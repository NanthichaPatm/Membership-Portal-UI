<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

const userProfile = ref({
  userId: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  memberNumber: "ME123F5488",
  membershipStatus: "Silver",
  profilePicture:
    "https://cdn.pixabay.com/photo/2016/11/23/00/57/adult-1851571_1280.jpg",
});


//MOCK UP DATA
const activities = ref([
{
    activityId: "1008",
    userId: "1",
    title: "Referral Bonus",
    description: "You referred a friend who booked a stay.",
    date: "2024-07-30",
    point: 4000,
  },
  {
    activityId: "1007",
    userId: "1",
    title: "Breakfast Included",
    description: "You added a breakfast package to your reservation.",
    date: "2024-07-28",
    point: 1000,
  },
  {
    activityId: "1006",
    userId: "1",
    title: "Room Booked",
    description: "You booked a deluxe room for your stay.",
    date: "2024-07-28",
    point: 5000,
  },
  {
    activityId: "1005",
    userId: "1",
    title: "Spa Session",
    description: "You enjoyed a relaxing spa session during your stay.",
    date: "2024-07-20",
    point: 3000,
  },
  {
    activityId: "1004",
    userId: "1",
    title: "Early Checkout",
    description: "You requested and received an early checkout for your room.",
    date: "2024-07-18",
    point: 2000,
  },
  {
    activityId: "1003",
    userId: "1",
    title: "Room Booked",
    description: "You booked a deluxe room for your stay.",
    date: "2024-07-16",
    point: 5000,
  },
  {
    activityId: "1002",
    userId: "1",
    title: "Referral Bonus",
    description: "You referred a friend who booked a stay.",
    date: "2024-07-16",
    point: 4000,
  },
  {
    activityId: "1001",
    userId: "1",
    title: "Room Booked",
    description: "You booked a deluxe room for your stay.",
    date: "2024-04-13",
    point: 10000,
  },
]);

const benefits = ref({
  Classic: [
    {
      benefitId: "101",
      title: "Free Wi-Fi",
      description: "Complimentary high-speed internet access during your stay.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/wifi.svg",
    },
    {
      benefitId: "102",
      title: "Room Upgrades",
      description:
        "Complimentary room upgrades at check-in, subject to availability.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/arrow-up.svg",
    },
    {
      benefitId: "103",
      title: "Daily Newspaper",
      description: "Complimentary daily newspaper delivered to your room.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/journal.svg",
    },
    {
      benefitId: "104",
      title: "Fitness Center Access",
      description: "Unlimited access to the hotel's fitness center.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/activity.svg",
    },
  ],
  Silver: [
    {
      benefitId: "201",
      title: "Free Night Award",
      description:
        "Enjoy one free night at any participating Category 1-8 hotel.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/moon-stars.svg",
    },
    {
      benefitId: "202",
      title: "Late Checkout",
      description: "Enjoy late checkout until 2 PM, subject to availability.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/alarm.svg",
    },
    {
      benefitId: "203",
      title: "Welcome Gift",
      description: "Receive a welcome gift upon arrival.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/gift.svg",
    },
    {
      benefitId: "204",
      title: "Complimentary Breakfast",
      description: "Enjoy complimentary breakfast during your stay.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/egg-fried.svg",
    },
  ],
  Gold: [
    {
      benefitId: "301",
      title: "Bonus Points",
      description:
        "Earn bonus points on every stay and redeem for free nights, dining, and more.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/award.svg",
    },
    {
      benefitId: "302",
      title: "Exclusive Offers",
      description: "Receive exclusive offers and discounts.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/tag.svg",
    },
    {
      benefitId: "303",
      title: "Complimentary Airport Transfer",
      description: "Enjoy complimentary airport transfer service.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/airplane.svg",
    },
    {
      benefitId: "304",
      title: "Personal Concierge Service",
      description:
        "Access to a personal concierge to assist with your travel needs.",
      imageUrl: "https://icons.getbootstrap.com/assets/icons/person-badge.svg",
    },
  ],
});

onMounted(() => {
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    userProfile.value = JSON.parse(storedProfile);
  } else {
    localStorage.setItem("userProfile", JSON.stringify(userProfile.value));
  }

  try {
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      const parsedActivities = JSON.parse(storedActivities);
      if (Array.isArray(parsedActivities) && parsedActivities.length > 0) {
        activities.value = parsedActivities;
      } else {
        localStorage.setItem("activities", JSON.stringify(activities.value));
      }
    } else {
      localStorage.setItem("activities", JSON.stringify(activities.value));
    }
  } catch (error) {
    console.error("Error parsing activities from localStorage", error);
    localStorage.setItem("activities", JSON.stringify(activities.value));
  }

  try {
    const storedBenefits = localStorage.getItem("benefits");
    if (storedBenefits) {
      const parsedBenefits = JSON.parse(storedBenefits);
      if (parsedBenefits) {
        benefits.value = parsedBenefits;
      } else {
        localStorage.setItem("benefits", JSON.stringify(benefits.value));
      }
    } else {
      localStorage.setItem("benefits", JSON.stringify(benefits.value));
    }
  } catch (error) {
    console.error("Error parsing benefits from localStorage", error);
    localStorage.setItem("benefits", JSON.stringify(benefits.value));
  }
});

const totalPoints = computed(() =>
  activities.value.reduce((sum, activity) => sum + activity.point, 0)
);
</script>

<template>
  <div class="main-container">
    <header>
      <img
        alt="Vue logo"
        class="logo mx-2"
        src="@/assets/logo.ico"
        width="32"
        height="32"
      />
      <h4>MEMBERSHIP PORTAL</h4>

      <div class="dropdown">
        <button
          class="btn dropdown-toggle pt-2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            alt="Profile Picture"
            class="profile-pic me-2 mb-1"
            :src="userProfile.profilePicture"
            width="24"
            height="24"
          />
          {{ userProfile.firstName }} {{ userProfile.lastName }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <RouterLink to="/account" class="dropdown-item">
              My account</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/benefit" class="dropdown-item">
              Membership Benefits</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/activities" class="dropdown-item">
              Activity Tracking</RouterLink
            >
          </li>
        </ul>
      </div>
    </header>
    <div class="main-content d-flex mt-5">
      <div class="side-nav me-2 d-flex flex-column align-items-center">
        <div class="card profile-card mb-3">
          <div class="card-header">
            <div
              class="d-flex flex-row justify-content-between align-items-center"
            >
              <div class="d-flex flex-row align-items-center">
                <img
                  src="@/assets/member-icon.png"
                  alt="Member Icon"
                  class="member-icon"
                  width="28"
                  height="28"
                />
                <strong class="card-detail me-3">MEMBERSHIP</strong>
              </div>

              <div>
                <strong class="status">{{
                  userProfile.membershipStatus
                }}</strong>
              </div>
            </div>

            <div>
              <div class="card-text">Current Point Balance</div>
              <strong class="card-detail">{{ totalPoints }}</strong>
              <div class="card-text">Member Number</div>
              <strong class="card-detail">
                {{ userProfile.memberNumber }}</strong
              >
              <div class="card-name">
                {{ userProfile.firstName }} {{ userProfile.lastName }}
              </div>
            </div>
          </div>
        </div>
        <nav class="side-nav-list d-flex flex-column">
          <RouterLink to="/" class="list-item">
            <i class="bi bi-clipboard-data me-1"></i>
            Overview</RouterLink
          >
          <RouterLink to="/account" class="list-item"
            ><i class="bi bi-person-circle me-1"></i>Profile
            Management</RouterLink
          >
          <RouterLink to="/benefit" class="list-item">
            <i class="bi bi-award me-1"></i>Membership Benefits
          </RouterLink>
          <RouterLink to="/activities" class="list-item"
            ><i class="bi bi-clock-history me-1"></i>Activity Tracking</RouterLink
          >
        </nav>
      </div>

      <RouterView class="router-view" />
    </div>
  </div>
</template>
<style scoped>
#app {
  background-color: var(--theme-light-blue);
}
.main-container {
  height: 100vh;
  background-image: url(https://cdn.pixabay.com/photo/2016/06/02/02/35/mesh-1430107_1280.png);
  background-size: 100vw 25vh; 
  background-repeat: no-repeat; 
  background-position: initial;
  font-family: "Times New Roman", serif;
  color: #333;
  background-color: var(--theme-light-blue);
}

header {
  width: 100%;
  display: flex;
  align-items: center;
  background: white;
  padding: 1rem;
  color: var(--theme-primary-blue) !important;
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header .logo {
  margin-right: 1rem;
}

header h4 {
  margin: 0;
  font-size: 1.25rem;
}

header .dropdown {
  margin-left: auto;
  align-self: flex-end;
  color: var(--theme-gray);
}

.profile-pic {
  border-radius: 50%;
}
.main-content {
  justify-content: center;
  padding-top: 80px;
}
.side-nav {
  flex: 0.2;
  padding: 1rem;
}

.status {
  background: url(https://cdn.pixabay.com/photo/2023/01/18/00/25/surface-7725831_1280.jpg);
  background-size: cover;
  border-radius: 0.5rem;
  padding: 0.25rem;
  font-size: 14px;
  color: var(--theme-dark-gray);
}

.card-text {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 12px;
  font-weight: 100;
  color: var(--theme-gray);
}

.card-detail {
  font-family: "Times New Roman", serif;
  font-size: 24px;
  font-weight: 400;
  color: white !important;
}

.card-name {
  font-family: sans-serif;
  font-size: 12px;
  font-weight: 100;
  color: var(--theme-light-gray);
}
.router-view {
  flex: 0.6;
  padding: 1rem;
  background: #ffffff;
  margin: 1.5rem;
  border-radius: 0.2rem;
}

.profile-card {
  background-image: url(https://cdn.pixabay.com/photo/2014/11/25/08/13/design-544955_1280.jpg); 
  background-size: cover; 
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 310px;
  height: 200px;
}

.side-nav-list {
  border-radius: 0.2rem;
  width: 310px;
  background: white;
  border: 1px solid var(--theme-light-gray);
  padding: 1rem;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.list-item {
  padding: 0.5rem 0.5rem;
  text-decoration: none;
  color: var(--theme-gray) !important;
  font-weight: 200;
  font-size: 18px;
}
.router-link-active {
  color: var(--theme-primary-blue) !important;
  font-weight: 400;
  border: 1px solid var(--theme-primary-blue);
  background: var(--theme-light-gray);
  border-radius: 0.2rem;
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .profile-card,
  .side-nav-list,
  .router-view {
    width: 90%;
  }

  .router-view {
    margin: 1rem 0;
  }

  header h4 {
    font-size: 1rem;
  }

  .list-item {
    font-size: 16px;
  }
}
</style>
