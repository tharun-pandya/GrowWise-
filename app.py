"""
GrowWise - AI-Powered Garden Planner
Hacktoberfest 2026: Week 1 "Touch Grass"
Built with Streamlit and designed for lightweight machines (<= 8GB RAM).
Core AI powered by open-weight Gemma 2 2B (via local Ollama) or Gemini cloud fallback.
"""

import streamlit as st
from growwise.knowledge_base import (
    GardenType,
    PlantCategory,
    get_all_plants,
    get_plant_by_id,
    get_categories,
)
from growwise.rules import (
    UserGardenInput,
    recommend_garden_plan,
)
from growwise.ai_engine import (
    generate_garden_explanation,
    generate_weekly_checklist,
    check_ollama_status,
    DEFAULT_GEMMA_MODEL,
    DEFAULT_OLLAMA_URL,
)

# Page configuration
st.set_page_config(
    page_title="GrowWise | AI Garden Planner",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom styling for clean, readable typography
st.markdown(
    """
    <style>
    .main-title { font-size: 2.2rem; font-weight: 700; color: #166534; margin-bottom: 0.2rem; }
    .subtitle { font-size: 1.05rem; color: #4b5563; margin-bottom: 1.5rem; }
    .badge-grounded { background-color: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; display: inline-block; }
    .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
    </style>
    """,
    unsafe_allow_html=True,
)

# Sidebar: User Inputs
st.sidebar.header("🌿 Your Garden Setup")

location_name = st.sidebar.text_input("Location / City", value="Seattle, WA")
hardiness_zone = st.sidebar.slider(
    "USDA Hardiness Zone",
    min_value=2,
    max_value=11,
    value=8,
    help="Determines winter survival and frost dates. Most of US/Europe ranges from Zone 4 to 9.",
)

garden_type_map = {
    "Container / Balcony Pots": GardenType.CONTAINER,
    "Raised Garden Bed": GardenType.RAISED_BED,
    "In-Ground Backyard Plot": GardenType.IN_GROUND,
    "Indoor Windowsill": GardenType.WINDOWSILL,
    "Greenhouse": GardenType.GREENHOUSE,
}
garden_type_label = st.sidebar.selectbox(
    "Garden Type",
    options=list(garden_type_map.keys()),
    index=0,
)
garden_type = garden_type_map[garden_type_label]

sunlight_hours = st.sidebar.slider(
    "Daily Direct Sunlight (Hours)",
    min_value=1.0,
    max_value=10.0,
    value=6.0,
    step=0.5,
    help="Direct uninterrupted sunlight: <3h is Full Shade, 3-6h is Partial Sun, 6+h is Full Sun.",
)

space_sq_ft = st.sidebar.number_input(
    "Available Space (sq ft)",
    min_value=1.0,
    max_value=500.0,
    value=12.0,
    step=1.0,
    help="For containers, 1 large 5-gal pot is approx 2 sq ft. A standard raised bed is 32 sq ft (4x8 ft).",
)

all_plants = get_all_plants()
plant_options = {p.id: f"{p.common_name} ({p.category.value})" for p in all_plants}

preferred_plant_ids = st.sidebar.multiselect(
    "Preferred Plants (Optional)",
    options=list(plant_options.keys()),
    format_func=lambda pid: plant_options[pid],
    default=["sweet_basil", "cherry_tomato"],
)

st.sidebar.divider()
st.sidebar.subheader("🤖 AI Engine Configuration")

# Ollama health check
ollama_running, ollama_msg, installed_models = check_ollama_status()

ai_provider_mode = st.sidebar.radio(
    "AI Engine Choice",
    options=[
        "Local Gemma 2 2B (Ollama - Open-Weight)",
        "Offline Grounded Synthesizer (Instant, 0 RAM / No Model)",
        "Google Gemini Cloud API",
    ],
    index=0 if ollama_running else 1,
)

gemma_model = DEFAULT_GEMMA_MODEL
gemini_key = ""

if "Local Gemma" in ai_provider_mode:
    if ollama_running:
        st.sidebar.success(f"Ollama detected! Installed: {', '.join(installed_models) if installed_models else 'None'}")
        if installed_models:
            gemma_model = st.sidebar.selectbox("Model", options=installed_models, index=0)
        else:
            st.sidebar.info("Tip: Run `ollama run gemma2:2b` in terminal to download Gemma.")
    else:
        st.sidebar.warning(
            "Local Ollama is not currently detected at localhost:11434.\n\n"
            "If Ollama is not running, GrowWise will automatically fallback to the offline verified synthesizer."
        )

elif "Google Gemini" in ai_provider_mode:
    gemini_key = st.sidebar.text_input("Gemini API Key (Optional if env set)", type="password")

# Main Content Area
col_header, col_badge = st.columns([3, 1])
with col_header:
    st.markdown('<div class="main-title">🌱 GrowWise Garden Planner</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="subtitle">Hacktoberfest 2026: Week 1 Touch Grass · Grounded Botanical Intelligence</div>',
        unsafe_allow_html=True,
    )
with col_badge:
    st.markdown(
        '<div style="text-align: right; padding-top: 10px;">'
        '<span class="badge-grounded">✓ USDA & RHS Grounded Data</span>'
        '</div>',
        unsafe_allow_html=True,
    )

# Run Planner Trigger
plan_btn = st.button("🌿 Plan My Garden", type="primary", use_container_width=True)

if plan_btn or "current_plan" in st.session_state:
    if plan_btn:
        # Construct verified input
        user_input = UserGardenInput(
            location_name=location_name,
            hardiness_zone=hardiness_zone,
            garden_type=garden_type,
            sunlight_hours=sunlight_hours,
            space_sq_ft=space_sq_ft,
            preferred_plant_ids=preferred_plant_ids,
        )
        with st.spinner("Running deterministic suitability rules & space allocation..."):
            plan = recommend_garden_plan(user_input, max_distinct_crops=5)
            st.session_state["current_plan"] = plan
    else:
        plan = st.session_state["current_plan"]

    # Metrics Row
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Space Allocated", f"{plan.total_space_used_sq_ft} / {space_sq_ft} sq ft")
    with m2:
        st.metric("Space Utilization", f"{plan.space_utilization_pct}%")
    with m3:
        st.metric("Suitable Crops Found", len(plan.suitable_plants))
    with m4:
        st.metric("Disqualified Crops", len(plan.unsuitable_plants))

    # Tabs for Plan Breakdown
    tab_recs, tab_ai, tab_checklist, tab_knowledge = st.tabs([
        "🔬 Deterministic Crop Rules",
        "💡 AI Strategic Advisor",
        "📅 4-Week Action Checklist",
        "📖 Grounded Knowledge Base",
    ])

    with tab_recs:
        st.subheader("1. Allocated Crops for Your Layout")
        if plan.allocated_plants:
            st.write(
                "These crops were mathematically vetted against your sunlight, container depth, and temperature zone."
            )
            cols = st.columns(len(plan.allocated_plants))
            for idx, (pid, count) in enumerate(plan.allocated_plants.items()):
                p = get_plant_by_id(pid)
                with cols[idx]:
                    st.info(f"### {p.common_name}\n**Quantity:** {count} plant(s)\n\n"
                            f"**Category:** {p.category.value}\n\n"
                            f"**Min Sun:** {p.min_sunlight_hours}h / day\n\n"
                            f"**Space Need:** {p.min_space_sq_ft} sq ft\n\n"
                            f"**Maturity:** {p.days_to_maturity} days")

            # Companion Synergies & Warnings
            if plan.companion_synergies:
                st.success("🤝 **Verified Companion Synergies Detected:**\n\n" +
                           "\n".join(f"- {s}" for s in plan.companion_synergies))

            if plan.companion_warnings:
                st.warning("⚠️ **Spacing Guidance:**\n\n" +
                           "\n".join(f"- {w}" for w in plan.companion_warnings))

        else:
            st.error("No crops could be safely allocated with your current inputs.")

        st.divider()
        st.subheader("2. Transparent Disqualification Log (Why Other Crops Failed)")
        st.write(
            "Every non-recommended plant is disqualified using deterministic botanical boundaries—no black-box decisions."
        )

        with st.expander(f"View {len(plan.unsuitable_plants)} Disqualified Crops and Exact Criteria"):
            for un in plan.unsuitable_plants:
                p = un.plant
                st.markdown(f"**{p.common_name}** (*{p.botanical_name}*)")
                for reason in un.disqualification_reasons:
                    st.markdown(f"- ❌ {reason}")
                st.caption(f"Verified Source: {p.source_citation}")
                st.markdown("---")

    with tab_ai:
        st.subheader("AI Horticultural Strategy & Personalized Narrative")
        st.write("Synthesized strictly from the pre-filtered, verified botanical data above.")

        provider_arg = "auto"
        if "Local Gemma" in ai_provider_mode:
            provider_arg = "gemma"
        elif "Offline" in ai_provider_mode:
            provider_arg = "offline"
        elif "Google Gemini" in ai_provider_mode:
            provider_arg = "gemini"

        with st.spinner("Synthesizing grounded explanation..."):
            explanation, engine_name = generate_garden_explanation(
                plan,
                provider=provider_arg,
                gemma_model=gemma_model,
                gemini_api_key=gemini_key,
            )

        st.caption(f"Generated via: **{engine_name}**")
        st.markdown(explanation)

    with tab_checklist:
        st.subheader("4-Week Actionable Gardening Checklist")
        st.write("Practical step-by-step tasks grounded in verified crop care schedules.")

        with st.spinner("Generating weekly tasks..."):
            checklist_md, chk_engine = generate_weekly_checklist(
                plan,
                weeks=4,
                provider=provider_arg,
                gemma_model=gemma_model,
                gemini_api_key=gemini_key,
            )

        st.markdown(checklist_md)
        st.download_button(
            label="📥 Download Checklist as Markdown",
            data=checklist_md,
            file_name=f"growwise_checklist_{location_name.replace(' ', '_').lower()}.md",
            mime="text/markdown",
        )

    with tab_knowledge:
        st.subheader("Verified Horticultural Knowledge Base (USDA & RHS Ground-Truth)")
        st.write(
            "GrowWise never guesses plant requirements. Inspect the verified specifications below:"
        )
        for p in all_plants:
            with st.expander(f"{p.common_name} ({p.botanical_name}) - {p.category.value}"):
                c1, c2 = st.columns(2)
                with c1:
                    st.write(f"**Min Sunlight:** {p.min_sunlight_hours} hrs/day")
                    st.write(f"**Compatible Types:** {', '.join(g.value for g in p.compatible_garden_types)}")
                    st.write(f"**Container Depth:** {p.min_container_depth_inches} inches")
                    st.write(f"**Space per plant:** {p.min_space_sq_ft} sq ft")
                    st.write(f"**Watering Need:** {p.watering_need.capitalize()}")
                with c2:
                    st.write(f"**Hardiness Zones:** {min(p.hardiness_zones)} to {max(p.hardiness_zones)}")
                    st.write(f"**Days to Maturity:** {p.days_to_maturity}")
                    st.write(f"**Difficulty:** {p.difficulty.capitalize()}")
                    st.write(f"**Soil Preference:** {p.soil_preference}")
                    st.write(f"**Data Source:** {p.source_citation}")

                st.write(f"**Care Summary:** {p.care_summary}")
                st.write("**Weekly Schedule:**")
                for w_num, desc in p.weekly_care_schedule.items():
                    st.write(f"- Week {w_num}: {desc}")

else:
    st.info("👈 Set your location and garden preferences in the sidebar, then click **Plan My Garden**!")
