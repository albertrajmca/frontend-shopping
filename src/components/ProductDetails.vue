<template>
  <v-card :loading="loading" class="mx-auto my-12" max-width="374">
    <img :src="product.image" alt="" />

    <v-card-item>
      <v-card-title>{{ product.name }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-rating
          :model-value="product.avg_rating"
          color="amber"
          density="compact"
          half-increments
          readonly
          size="small"
        ></v-rating>

        <div class="text-grey ms-4">
          {{ product.avg_rating }}
        </div>
      </v-row>

      <div class="my-4 text-subtitle-1">&#8377;{{ product.price }}</div>

      <div>{{ product.description }}</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-container>
      <v-card
        v-for="(item, index) in product.reviews"
        :key="index"
        class="mx-auto"
        color="white"
        theme="dark"
        max-width="400"
      >
        <v-card-title>{{ item.title }}</v-card-title>
        <template v-slot:prepend>
          <v-icon size="x-large"></v-icon>
        </template>

        <v-card-text class="text-h5 py-2">
          {{ item.comment }}
        </v-card-text>

        <v-card-actions>
          <v-list-item class="w-100">
            <v-list-item-title>{{ item.user.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <v-rating
                :model-value="item.rating"
                color="amber"
                density="compact"
                half-increments
                readonly
                size="small"
              ></v-rating>
            </v-list-item-subtitle>
          </v-list-item>
        </v-card-actions>

        <v-divider v-if="index !== product.reviews.length - 1"></v-divider>
      </v-card>
     </v-container>

     <v-divider class="mx-4 mb-1"></v-divider>

      <v-card-title>Leave a comment</v-card-title>
      <div class="px-4">
        <v-sheet width="300" class="mx-auto">
          <div v-if="apiToken">
          <v-form @submit.prevent="submitReview">
            <v-text-field v-model="title" label="Title"></v-text-field>
            <v-text-field v-model="rating" label="Rating (1-5)"  type="number" :rules="[ratingRule]"></v-text-field>
            <v-textarea v-model="comments" label="Comments" variant="outlined"></v-textarea>          
            <v-btn class="submit-btn" variant="outlined" type="submit">Submit Review</v-btn>
          </v-form>
          </div>
          <div v-if="!apiToken">
            <v-btn class="button" type="button"  variant="outlined">
                <router-link class="button"  :to="{ name: 'signup' }">Sign Up
                </router-link>
            </v-btn> <span>(sign up required)</span>
        </div>
        </v-sheet>
      </div>

  </v-card>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],

  data() {
    return {
      baseUrl: 'http://localhost:8000/api',
      product: {},
      title: "",
      rating: "",
      comments: "",
      formSubmitted: false ,
    };
  },
  methods: {

    loadProduct() {
      axios
      .get(`${this.baseUrl}/products/${this.id}/show`)
      .then((response) => {
        this.product = response.data.data;
      });
    },

    submitReview() {

      const apiToken = localStorage.getItem("api_token");
      axios
        .post(
          `${this.baseUrl}/products/${this.id}/review`,
          {
            title: this.title,
            rating: this.rating,
            comment: this.comments,
          },
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        )
        .then((response) => {
          this.formSubmitted = true; 
          console.log(response.data);
          this.loadProduct();
        })
        .catch((error) => {
          console.log(error);
        });
          this.title = ""; // Clear the input fields after successful submission
          this.rating = "";
          this.comments = "";
    },
  },
  mounted() {
    // get the product id from the route params
    const productId = this.$route.params.id;
    // store the product id in local storage
    localStorage.setItem('product_id', productId);

    this.loadProduct();
  },

  computed: {
    apiToken() {
      return localStorage.getItem("api_token");
    },
    ratingRule() {
      return (value) => {
        if (this.formSubmitted && !value) return 'Rating is required'; // Only show error message if formSubmitted is true and value is empty
        if (value < 1 || value > 5) return 'Rating must be between 1 and 5';
        return true;
      }
    }
  }
};
</script>

<style scoped>
.submit-btn {
    margin-bottom: 14px;
    background-color: skyblue;
}

 .button {
  background-color: skyblue;
  border: none;
  color: black;
  text-decoration: none; 
  border-radius: 5px;
  margin-bottom: 5px;
 }
</style>