<script setup>
import { ref, onMounted } from "vue";


const userProfile = ref(null);
const showModal = ref(false);
const tempProfile = ref({
  firstName: "",
  lastName: "",
  email: "",
  profilePicture: "",
});


onMounted(() => {
  try {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      userProfile.value = JSON.parse(storedProfile);
    } 
  } catch (error) {
    console.error("Error parsing userProfile from localStorage", error);
  }
});

const openModal = () => {
  if (userProfile.value) {
    tempProfile.value = { ...userProfile.value };
    showModal.value = true;
  }
};


const saveChanges = () => {
  if (tempProfile.value) {
    userProfile.value = { ...tempProfile.value };
    localStorage.setItem("userProfile", JSON.stringify(userProfile.value));
    showModal.value = false; 

    window.location.reload();
  }
};

const cancelChanges = () => {
  showModal.value = false; 
};

// Method to handle image file selection
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
</script>
<template>
  <div class="main-content container text-center py-5">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3"
    >
      <h1 class="display-5 mb-md-0">Profile Management</h1>
      <button class="btn text-secondary" @click="openModal">
        <i class="bi bi-pencil-square"></i> Edit
      </button>
    </div>
    <hr />
    <div v-if="userProfile">
      <div
        class="d-flex flex-column flex-lg-row align-items-center justify-content-lg-between"
      >
        <div class="my-3 text-center">
          <img
            alt="Profile Picture"
            class="profile-pic rounded-circle shadow"
            :src="userProfile.profilePicture"
            width="200"
            height="200"
          />
        </div>
        <div class="list-group text-start flex-grow-1 mt-3 mt-lg-0">
          <div
            class="list-group-item d-flex flex-column flex-lg-row mx-2 mx-lg-5"
          >
            <div class="w-100 w-lg-50 mb-2 mb-lg-0">
              <strong>Firstname</strong> <br />
              <p>{{ userProfile.firstName }}</p>
            </div>
            <div class="w-100 w-lg-50">
              <strong>Lastname</strong> <br />
              <p>{{ userProfile.lastName }}</p>
            </div>
          </div>
          <div
            class="list-group-item d-flex flex-column flex-lg-row mx-2 mx-lg-5"
          >
            <div class="w-100 w-lg-50 mb-2 mb-lg-0">
              <strong>Status</strong> <br />
              <p>{{ userProfile.membershipStatus }}</p>
            </div>
            <div class="w-100 w-lg-50">
              <strong>Member Number</strong> <br />
              <p>{{ userProfile.memberNumber }}</p>
            </div>
          </div>
          <div class="list-group-item mx-2 mx-lg-5">
            <strong>Email</strong> <br />
            <p>{{ userProfile.email }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">User profile data is not available.</p>
    </div>

    <!-- Modal for editing profile -->

<div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="cancelChanges">×</button>
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveChanges">
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
        <hr>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
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

.profile-pic {
  border: 5px solid #ddd;
  object-fit: cover;
}

.profile-preview{
  object-fit: cover;
}

button {
  margin: 10px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
}

.list-group-item {
  border: 1px solid var(--theme-light-blue) !important;
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

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .list-group-item {
    flex-direction: column;
  }

  .list-group-item > div {
    width: 100%;
  }

  .btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .d-flex.flex-column.flex-md-row.justify-content-between.align-items-center.mb-3 {
    flex-direction: column;
  }

  .text-end {
    text-align: center !important;
  }
}
</style>
