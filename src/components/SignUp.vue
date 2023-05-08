<template>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="name"
        :rules="[rules.required]"
        label="Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="email"
        :rules="[rules.required, rules.email]"
        label="Email"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.required]"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        :rules="[rules.required, confirmPasswordRule]"
        label="Confirm Password"
        type="password"
        required
      ></v-text-field>
      <v-btn @click="submitForm" :disabled="!valid">Submit</v-btn>
    </v-form>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        baseUrl: 'http://localhost:8000/api',
        valid: false,
        rules: {
          required: (value) => !!value || "Field is required",
          email: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
            "Invalid email address",
        },
      };
    },
    methods: {

      submitForm() {
        if (this.$refs.form.validate()) {
            axios
            .post(`${this.baseUrl}/users/signup`, {
                name: this.name,
                email: this.email,
                password: this.password,
                password_confirmation: this.confirmPassword,
            })
            .then((response) => {
            // Store the API token in a cookie or local storage
            const apiToken = response.data.token;
            localStorage.setItem("api_token", apiToken);
            const productId = localStorage.getItem("product_id");

            // this.$router.push('/product');
            this.$router.push({ name: 'product', params: { id: productId }});
            })
            .catch((error) => {
            console.log(error);
            });
        }
      },
    },
    computed: {
      confirmPasswordRule() {
        return (value) =>
          value === this.password || "Passwords do not match";
      },
    },
  };
  </script>
  