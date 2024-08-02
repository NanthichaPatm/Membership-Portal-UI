<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// Load user profile, activities, and benefits from localStorage
const userProfile = ref({});
const activities = ref([]);
const benefits = ref({ Classic: [], Silver: [], Gold: [] });

const router = useRouter();

onMounted(() => {
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    userProfile.value = JSON.parse(storedProfile);
    membershipStatus.value = userProfile.value.membershipStatus || "Classic";
  }

  const storedActivities = localStorage.getItem("activities");
  if (storedActivities) {
    activities.value = JSON.parse(storedActivities);
  }

  const storedBenefits = localStorage.getItem("benefits");
  if (storedBenefits) {
    benefits.value = JSON.parse(storedBenefits);
  }
});

// Membership status
const membershipStatus = ref("Classic");

// Calculate total points from activities
const totalPoints = computed(() =>
  activities.value.reduce((sum, activity) => sum + activity.point, 0)
);

// Get all benefits based on membership status
const tiers = ["Classic", "Silver", "Gold"];
const allBenefits = computed(() => {
  let allBenefitsArray = [];
  const userTierIndex = tiers.indexOf(membershipStatus.value);
  for (let i = 0; i <= userTierIndex; i++) {
    allBenefitsArray = allBenefitsArray.concat(benefits.value[tiers[i]]);
  }
  return allBenefitsArray;
});

const recentActivities = computed(() => activities.value.slice(0, 4));

// Modal management for profile editing
const showModal = ref(false);
const tempProfile = ref({ ...userProfile.value });

const editProfile = () => {
  tempProfile.value = { ...userProfile.value };
  showModal.value = true;
};

const saveProfile = () => {
  userProfile.value = { ...tempProfile.value };
  localStorage.setItem("userProfile", JSON.stringify(userProfile.value));
  membershipStatus.value = userProfile.value.membershipStatus || "Classic";
  showModal.value = false;
  window.location.reload();
};

const closeModal = () => {
  showModal.value = false;
};

// Modal management for benefit details
const showBenefitModalState = ref(false);
const selectedBenefit = ref({});

const showBenefitModal = (benefit) => {
  selectedBenefit.value = benefit;
  showBenefitModalState.value = true;
};

const hideBenefitModal = () => {
  showBenefitModalState.value = false;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      tempProfile.value.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const navigateToActivities = () => {
  router.push({ name: "activities" });
};
</script>
<template>
  <div class="dashboard container py-5">
    <!-- Dashboard Header -->
    <div class="dashboard-header d-flex align-items-center mb-4">
      <div class="user-info d-flex align-items-center">
        <img
          :src="userProfile.profilePicture"
          alt="Profile Picture"
          class="rounded-circle me-3 profile-picture shadow"
        />
        <div>
          <div class="d-flex">
            <h2>{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
            <button class="btn text-secondary" @click="editProfile">
              <i class="bi bi-pencil-square"></i>
            </button>
          </div>

          <p>{{ userProfile.email }}</p>
        </div>
      </div>
      <h5 class="membership-status text-center">
        Membership Status <br />
        <span class="badge">{{ membershipStatus }}</span>
      </h5>
    </div>
    <hr />

    <div class="sub-section d-flex flex-row mb-4">
      <!-- Benefits and Loyalty Points Section -->
      <div class="benefits-points-section mb-5">
        <h3 class="section-title">Membership Benefits & Loyalty Points</h3>
        <div class="points-summary card text-center mb-2">
          <div class="card-body">
            <strong>Total Loyalty Points</strong>
            <h1>{{ totalPoints }}</h1>
          </div>
        </div>
        <div class="benefits-grid">
          <div
            v-for="benefit in allBenefits"
            :key="benefit.benefitId"
            :class="['benefit-card', 'card']"
            @click="showBenefitModal(benefit)"
          >
            <div class="card-body text-center">
              <img
                :src="benefit.imageUrl"
                alt="Benefit Image"
                class="benefit-icon mb-2"
              />
              <p class="card-title fs-6 fw-lighter">{{ benefit.title }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities Section -->
      <div class="activities-section mb-5">
        <h3 class="section-title">Recent Activities</h3>
        <div class="activities-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.activityId"
            class="activity-item card mb-3"
          >
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>{{ activity.title }}</h5>
                </div>
                <strong class="points-earned"
                  >+{{ activity.point }} Points</strong
                >
              </div>
              <p class="activity-date text-muted">{{ activity.date }}</p>
            </div>
          </div>
        </div>
        <div class="text-center mt-1">
          <button class="btn btn-outline-primary" @click="navigateToActivities">
            View All Activities
          </button>
        </div>
      </div>
    </div>

    <!-- Benefit Modal -->
    <div
      v-if="showBenefitModalState"
      class="modal-overlay"
      @click="hideBenefitModal"
    >
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="hideBenefitModal">×</button>
        <img
          :src="selectedBenefit.imageUrl"
          alt="Benefit Image"
          class="modal-icon"
        />
        <h3>{{ selectedBenefit.title }}</h3>
        <p>{{ selectedBenefit.description }}</p>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">×</button>
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
          <div class="form-group mb-3">
            <label>First Name</label>
            <input
              v-model="tempProfile.firstName"
              type="text"
              class="form-control"
            />
          </div>
          <div class="form-group mb-3">
            <label>Last Name</label>
            <input
              v-model="tempProfile.lastName"
              type="text"
              class="form-control"
            />
          </div>
          <div class="form-group mb-3">
            <label>Email</label>
            <input
              v-model="tempProfile.email"
              type="email"
              class="form-control"
            />
          </div>
          <div class="form-group mb-3">
            <label>Profile Picture</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="form-control"
            />
          </div>
          <img
            v-if="tempProfile.profilePicture"
            :src="tempProfile.profilePicture"
            alt="Profile Preview"
            class="profile-preview rounded-circle shadow mt-2 align-self-center"
            width="150"
            height="150"
          />
          <hr />
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard {
  background-color: #f5f7fa;
  border-radius: 10px;
  padding: 5px;
}

.dashboard-header {
  padding: 10px;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  gap: 4rem;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.membership-status {
  font-weight: bold;
  color: #007bff;
}

.membership-status .badge {
  background-color: var(--theme-dark-gray);
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 5rem;
  margin-left: 5px;
}

.sub-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.benefits-points-section,
.activities-section {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 370px;
}

.section-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

.benefits-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  flex-grow: 1;
  max-height: 300px;
  overflow-y: auto;
}

.benefit-card {
  flex: 1 1 calc(33.33% - 10px);
  max-width: 160px;
  min-width: 130px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
  text-align: center;
  padding: 10px;
}

.benefit-card:hover {
  transform: translateY(-5px);
}

.benefit-icon {
  width: 20px;
  height: 20px;
}

.points-summary {
  background-color: var(--theme-light-blue);
  color: #ffffff;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 20px;
}

.activities-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 400px;
}

.activity-item {
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.points-earned {
  color: green;
  font-weight: bold;
}

.activity-date {
  font-size: 12px;
  color: gray;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  max-width: 500px;
  width: 100%;
}

.profile-preview {
  object-fit: cover;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-icon {
  height: 50px;
  object-fit: contain;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .sub-section {
    flex-direction: column;
    align-items: center;
  }

  .benefits-points-section,
  .activities-section {
    max-width: 100%;
    flex: 1 1 100%;
  }

  .benefit-card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>
