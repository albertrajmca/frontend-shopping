<template>
  <div>

 
    <div>
      <img :src="product.image" alt="" />
    </div>
    <div>
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>&#8377;{{ product.price }}</p>
      <p class="product-rating">{{ product.avg_rating }}*</p>

      <div>
        <h2>Product Reviews</h2>
        <ul>
          <li v-for="oldreview in product.reviews" :key="oldreview.id">
            <div>Title: {{ oldreview.title }} - {{ oldreview.user.name }}</div>
            <div>Rating: {{ oldreview.rating }}</div>
            <div>Comment: {{ oldreview.comment }}</div>
            <hr />
          </li>
        </ul>
      </div>

      <div class="review-form">
        <h2>Submit a Review</h2>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <v-text-field v-model="title" label="Title" variant="outlined"></v-text-field>
          </div>
          <div class="form-group">
            <label>Star</label>
            <v-radio-group v-model="rating" inline>
              <v-radio label="*" value="1"></v-radio>
              <v-radio label="**" value="2"></v-radio>
              <v-radio label="***" value="3"></v-radio>
              <v-radio label="****" value="4"></v-radio>
              <v-radio label="*****" value="5"></v-radio>
            </v-radio-group>
          </div>
          <div class="form-group">
            <v-textarea v-model="comments" label="Comments" variant="outlined"></v-textarea>
          </div>
          <div class="form-group">
            <v-btn class="submit-btn" variant="outlined" type="submit">
              Submit Review
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const apiToken = localStorage.getItem('api_token');
export default {
  props: ["id"],
  data() {
    return {
      product: {},
      title: '',
      rating: '',
      comments: ''
    };
  },
  methods: {
    submitReview() {
        axios.post(`http://localhost:8000/api/products/${this.id}/review`, {
            title: this.title,
            rating: this.rating,
            comment: this.comments
        }, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        })
        .then(response => {
            console.log(response.data);
            axios.get(`http://localhost:8000/api/products/${this.id}/show`)
            .then((productDetailsResponse) => {
              this.product = productDetailsResponse.data.data;
            });
        })
        .catch(error => {
            console.log(error);
        });
    
      
    },
  },
  mounted() {
    // show api
    axios
      .get(`http://localhost:8000/api/products/${this.id}/show`)
      .then((response) => {
        this.product = response.data.data;
      });

    if (!apiToken) {
        // sign up and get token api 
        axios.post('http://localhost:8000/api/users/signup', {
          name: 'random user',
          email: 'example1@example.com',
          password: 'mypassword',
          password_confirmation: 'mypassword'
        })
        .then(response => {
            // Store the API token in a cookie or local storage
            const apiToken = response.data.token;
            localStorage.setItem('api_token', apiToken);
        })
        .catch(error => {
            console.log(error);
        });
    }
  },
};
</script>

<style scoped>
.review-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
}

.submit-btn {
  width: 100%;
  max-width: 500px;
}

div {
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #ccc;
}

h2 {
  font-size: 18px;
  margin: 0 0 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: px 0;
  padding: 5px;
  /* border: 1px solid #eee; */
}

div > div {
  margin: 5px 0;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 3px 0;
}

</style>