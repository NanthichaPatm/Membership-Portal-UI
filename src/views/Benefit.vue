<script setup>
import { ref, computed, onMounted } from "vue";

const benefits = ref({
  Classic: [],
  Silver: [],
  Gold: [],
});

onMounted(() => {
  try {
    const storedBenefits = localStorage.getItem("benefits");
    if (storedBenefits) {
      const parsedBenefits = JSON.parse(storedBenefits);
      if (parsedBenefits) {
        benefits.value = parsedBenefits;
      } else {
        console.warn("Benefits data in localStorage is invalid.");
        benefits.value = { Classic: [], Silver: [], Gold: [] };
      }
    } else {
      console.warn("No benefits data found in localStorage.");
      benefits.value = { Classic: [], Silver: [], Gold: [] };
    }
  } catch (error) {
    console.error("Error parsing benefits from localStorage", error);
    benefits.value = { Classic: [], Silver: [], Gold: [] };
  }
});

const tiers = ["Classic", "Silver", "Gold"];
const tierNames = {
  Classic: "Classic Benefits",
  Silver: "Silver Benefits",
  Gold: "Gold Benefits",
};

const activeTab = ref("Classic");
const membershipStatus = ref("");

onMounted(() => {
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    const userProfile = JSON.parse(storedProfile);
    membershipStatus.value = userProfile.membershipStatus || "Classic";
    activeTab.value = userProfile.membershipStatus || "Classic";
  } else {
    membershipStatus.value = "Classic";
    activeTab.value = "Classic";
  }
});

const allBenefits = computed(() => {
  let allBenefitsArray = [];
  const userTierIndex = tiers.indexOf(activeTab.value);
  for (let i = 0; i <= userTierIndex; i++) {
    allBenefitsArray = allBenefitsArray.concat(benefits.value[tiers[i]]);
  }
  return allBenefitsArray;
});

// Modal state
const showModal = ref(false);
const selectedBenefit = ref({});
const showBenefitModal = (benefit) => {
  selectedBenefit.value = benefit;
  showModal.value = true;
};
const hideBenefitModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="main-content container text-center py-5">
    <div
      class="d-flex flex-column flex-md-row justify-content-start align-items-center mb-3"
    >
      <h1 class="display-5 mb-md-0">Membership Benefits</h1>
    </div>
    <hr />
    <div>
      Your membership status is <strong>{{ membershipStatus }}</strong>
    </div>
    <!-- Membership Tabs -->
    <div class="d-flex justify-content-center mb-4">
      <div
        v-for="tier in tiers"
        :key="tier"
        :class="['tab', { active: activeTab === tier }]"
        @click="activeTab = tier"
      >
        <h3>{{ tierNames[tier] }}</h3>
        <p v-if="tier === 'Classic'">Free to join</p>
        <p v-else-if="tier === 'Silver'">25K Base Points</p>
        <p v-else-if="tier === 'Gold'">50K Base Points</p>
      </div>
    </div>
    <div>
      <div class="row mt-3">
        <div
          class="col-md-3"
          v-for="benefit in allBenefits"
          :key="benefit.benefitId"
        >
          <div
            class="card mb-4"
            @click="showBenefitModal(benefit)"
            style="cursor: pointer"
          >
            <div class="card-img-border mx-auto mt-4">
              <img
                :src="benefit.imageUrl"
                class="card-img-top mx-auto"
                :alt="benefit.title"
              />
            </div>

            <div class="card-body">
              <p class="card-title">{{ benefit.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="hideBenefitModal">
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
  </div>
</template>

<style scoped>
/* Styling for the tabs */
.tab {
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 10px;
  border-bottom: 2px solid transparent;
}
.tab.active {
  border-bottom: 2px solid #007bff;
}
.tab h3 {
  margin: 0;
}
.tab p {
  margin: 0;
}

.card {
  border: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
}

/* Card and inactive benefit styling */
.card-img-top {
  height: 32px;
  width: 32px;
  object-fit: contain;
}

.card-img-border {
  border: 3px solid var(--theme-light-blue) !important;
  border-radius: 50%;
  padding: 0.75rem;
}

.inactive-benefit {
  opacity: 0.5;
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
  max-width: 400px;
  width: 100%;
}

.modal-icon {
  height: 50px;
  object-fit: contain;
  margin-bottom: 20px;
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
</style>
