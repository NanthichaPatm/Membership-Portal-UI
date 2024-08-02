<script setup>
import { ref, computed, onMounted } from "vue";

const activities = ref([]);

onMounted(() => {
  try {
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      const parsedActivities = JSON.parse(storedActivities);
      if (Array.isArray(parsedActivities)) {
        activities.value = parsedActivities.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      } else {
        console.warn("Activities data in localStorage is not an array.");
        activities.value = [];
      }
    } else {
      console.warn("No activities data found in localStorage.");
      localStorage.setItem("activities", JSON.stringify(activities.value));
    }
  } catch (error) {
    console.error("Error parsing activities from localStorage", error);
    activities.value = [];
  }
});

const totalPoints = computed(() =>
  activities.value.reduce((sum, activity) => sum + activity.point, 0)
);

const tiers = [
  { name: "Classic", threshold: 0, icon: "bi bi-bag" },
  { name: "Silver", threshold: 25000, icon: "bi bi-binoculars" },
  { name: "Gold", threshold: 50000, icon: "bi bi-star" },
];

const currentTier = computed(() => {
  let tier = tiers[0];
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalPoints.value >= tiers[i].threshold) {
      tier = tiers[i];
      break;
    }
  }
  return tier;
});

const nextTier = computed(() => {
  const nextIndex = tiers.indexOf(currentTier.value) + 1;
  return tiers[nextIndex] || currentTier.value;
});

const progressPercentage = computed(() => {
  if (totalPoints.value >= 50000) return 100;
  return (totalPoints.value / 50000) * 100;
});

const tierPositions = computed(() => {
  return tiers.map((tier) => (tier.threshold / 50000) * 100);
});

// Pagination
const itemsPerPage = 4;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(activities.value.length / itemsPerPage)
);
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return activities.value.slice(start, start + itemsPerPage);
});
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<template>
  <div class="main-content container">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3"
    >
      <h1 class="display-5 mb-md-0">Activities Tracking</h1>
      <hr />
    </div>

    <div class="content-summary d-flex justify-content-evenly">
      <div class="d-flex flex-column align-items-center flex-fill">
        <div class="tier-markers d-flex justify-content-between mb-3">
          <div
            v-for="tier in tiers"
            :key="tier.name"
            class="d-flex flex-column text-center"
          >
            <span>{{ tier.name }}</span>
            <i :class="[tier.icon, 'tier-icon']"></i>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-bar progress-bar-striped progress-bar-animated">
            <div class="progress-background"></div>
            <div
              class="progress-indicator"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
      <div class="point-summary-box mt-3 mx-3">
        <p>Total Loyalty Points</p>
        <h3>{{ totalPoints }}</h3>
      </div>
    </div>

    <div class="activity-history mt-4">
      <p>Activity History</p>
      <ul>
        <li v-for="activity in paginatedActivities" :key="activity.activityId">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="activity-title">{{ activity.title }}</h5>
                <p class="activity-description">{{ activity.description }}</p>
              </div>
              <strong class="activity-points"
                >+{{ activity.point }} Points</strong
              >
            </div>
            <p class="activity-date text-muted">{{ activity.date }}</p>
          </div>
        </li>
      </ul>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
}

.progress-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
  position: relative;
}

.point-summary-box {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.25rem;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: #e9ecef;
  border-radius: 25px;
  overflow: hidden;
}

.progress-background {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #e9ecef;
}

.progress-indicator {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #007bff;
  border-radius: 25px 0 0 25px;
  transition: width 0.3s;
}

.tier-markers {
  width: 100%;
  max-width: 600px;
}

.tier-icon {
  font-size: 1.5rem;
}

.tier-marker {
  text-align: center;
  font-size: 1rem;
}

.tier-marker span {
  display: block;
  font-size: 0.75rem;
}

.activity-history ul {
  list-style: none;
  padding: 0;
}

.activity-history li {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
}

.activity-item {
  display: flex;
  width: 100%;
}

.activity-date {
  flex: 0 0 150px;
  font-size: 14px;
  text-align: left;
}

.activity-details {
  flex-grow: 1;
  text-align: left;
}

.activity-title {
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
}

.activity-description {
  margin: 5px 0;
  font-size: 14px;
}

.activity-points {
  font-weight: bold;
  font-size: 14px;
  color: #007bff;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.pagination-controls button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Responsive styles */
@media (max-width: 768px) {
  .main-content {
    padding: 0.5rem;
  }
  .content-summary {
    display: flex;
    flex-direction: column;
  }

  .progress-container {
    max-width: 100%;
  }

  .point-summary-box {
    margin-top: 1rem;
  }

  .tier-markers {
    align-items: center;
  }

  .activity-date {
    flex: 0 0 100px;
  }

  .activity-history li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
