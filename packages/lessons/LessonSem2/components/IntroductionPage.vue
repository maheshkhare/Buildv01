<template>
  <div class="overview-card">
    <h2 class="title">
      Overview of The Ability – Cognition of Figural Transformation
    </h2>

    <div class="info-grid">
      <div class="info-row">
        <span class="label">Academic skill :</span>
        <span class="value">Spatial Conservation (Piaget)</span>
      </div>

      <div class="info-row">
        <span class="label">Curricular area :</span>
        <span class="value">Mathematics</span>
      </div>

      <div class="info-row">
        <span class="label">Consequences if ability is not developed :</span>
        <span class="value">
          Difficulty with perspective; will be inhibited in geometry
        </span>
      </div>

      <div class="info-row">
        <span class="label">Strengths if ability is well developed :</span>
        <span class="value">
          Able to orient object in space; good perspective
        </span>
      </div>
    </div>

    <div class="summary-box">
      <span class="label">Summary :</span>
      <p class="value">
        The ability to transform information into a different form or different
        perspective is foundational to creative problem-solving. This module
        introduces transformations at a figural level.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AbilityOverview",
};
</script>

<style scoped>
.overview-card {
  max-width: 900px;
  margin: 0rem auto;
  padding: 3rem 3.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.8;
}

.title {
  text-align: center;
  font-weight: 800;
  font-size: 1.75rem;
  margin-bottom: 3rem;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Increased vertical spacing */
}

.info-row {
  display: flex;
  gap: 0.5rem;
  font-size: 1.05rem;
}

.label {
  font-weight: 700;
  color: #34495e;
}

.value {
  flex: 1;
  color: #2c3e50;
}

.summary-box {
  margin-top: 3rem;
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  border-left: 5px solid #4a90e2;
  border-radius: 8px;
}

.summary-box .label {
  font-weight: 800;
  color: #2c3e50;
  font-size: 1.1rem;
}

.summary-box .value {
  margin-top: 0.75rem;
  color: #34495e;
  font-size: 1.05rem;
}
</style>
