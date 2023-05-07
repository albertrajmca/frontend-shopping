<template>
  <v-card class="mx-auto" max-width="960">
    <v-layout>
      <v-navigation-drawer
        floating
        permanent
        style="background-color: #84c3b9"
      >
        <v-list density="compact" nav>
          <v-toolbar flat color="secondary" style="height:45px" dark>
            <v-btn icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Filters</v-toolbar-title>
          </v-toolbar>


          <v-card-text>
            <h2 class="text-h6 mb-2">Price</h2>

            <v-range-slider 
              v-model="priceRange" 
              @update:modelValue="debouncedApplyPriceFilter"
              :min="minPrice" 
              :max="maxPrice" 
              :step="stepPrice" 
              thumb-label>
          </v-range-slider>
          
          <label> Min : <strong>{{ priceRange[0] }}</strong> - Max : <strong>{{ priceRange[1] }}</strong></label>

           
          </v-card-text>

          <v-card-text>
            <h2 class="text-h6 mb-2">Category</h2>
            <v-chip-group v-model="categoryfilterchip" column multiple>
              <v-chip
                filter
                variant="outlined"
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-card-text>
            <h2 class="text-h6 mb-2">Sort</h2>

            <div class="sort">
              <a
                href="#"
                class="button"
                @click="handleClick('price:asc')"
                >Price - Low to High</a
              >
            </div>
            <div class="sort">
              <a
               class="button"
                href="#"
                @click="handleClick('price:desc')"
                >Price - High to Low</a
              >
            </div>

            <div class="sort">
              <a
                class="button"
                href="#"
                @click="handleClick('category:asc')"
                >Category A-Z</a
              >
            </div>

            <div class="sort">
              <a
                class="button"
                href="#"
                @click="handleClick('category:desc')"
                >Category Z-A</a
              >
            </div>
            <div class="sort">
              <a
                class="button"
                href="#"
                @click="handleClick('availability:asc')"
                >Lowest Units </a
              >
            </div>

            <div class="sort">
              <a
                class="button"
                href="#"
                @click="handleClick('availability:desc')"
                >Highest Units</a
              >
            </div>
          </v-card-text>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="secondary" density="compact">
        <v-app-bar-title>ShopWave</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <v-row dense>
            <v-col v-for="item in items" :key="item.id" cols="3">
              <router-link
                class="rlink"
                :to="{ name: 'product', params: { id: item.id } }"
              >
                <v-card
                  class="mx-auto vcard"
                  max-width="344"
                  variant="outlined"
                  style="min-height: 400px"
                >
                  <v-card-item>
                    <div>
                      <div class="text-overline mb-1">
                        {{ item.name }} - {{ item.category.name }}
                      </div>
                      <div class="text-caption">
                        <v-img
                          :src="item.image"
                          aspect-ratio="1"
                          cover
                          class="bg-grey-lighten-2"
                        />
                      </div>
                      <div class="text-h8 mb-1">&#8377;{{ item.price }}</div>
                      <div class="text-h10 mb-1">{{ item.description }}</div>

                      <v-btn variant="outlined" style="background-color:#E1F5FE">
                        {{ item.avg_rating }}*
                      </v-btn>
                    </div>
                  </v-card-item>
                </v-card>
              </router-link>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>

  
</template>

<script>
import axios from "axios";
import { debounce } from 'lodash';

export default {
  data() {
    return {
      baseUrl: 'http://localhost:8000/api',

      items: [],
      categories: [],
      categoryfilterchip: [],
      selectedItem: null,

    // hold all applied filters 
       queryParams: {},

      // price filter configs 
      priceRange: [100, 1000],
      maxPrice: 2000,
      minPrice: 0,
      stepPrice: 100,
    };
  },
  methods: {

    // sort 
    handleClick(sortValue) {
      this.queryParams['sort'] = sortValue;
      this.loadProducts(this.getQueryParams('/products/list'));
    },

    // price filter apply
    debouncedApplyPriceFilter: debounce(function(price) {
      this.queryParams['price'] = `${price[0]},${price[1]}`;
      this.loadProducts(this.getQueryParams('/products/list'));
    }, 500),
 

    // computing the query parameters
    getQueryParams(apiEndpoint) {
      let url = new URL(this.baseUrl+apiEndpoint);
      Object.keys(this.queryParams).forEach((key) =>
        url.searchParams.append(key, this.queryParams[key])
      );
      return url.toString();
    },

    // load or refresh product list data
    loadProducts(query) {
      axios
        .get(query)
        .then((response) => {
          this.items = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // apply categor filter
    applyCategoryFilter() {
      const selectedCategories = this.categoryfilterchip.join(","); // Join the selected categories into a comma-separated string
      this.queryParams['category'] = selectedCategories;
      this.loadProducts(this.getQueryParams('/products/list'));
    },
  },


  watch: {
    categoryfilterchip: function () {
      this.applyCategoryFilter();
    },
  },

  mounted() {

    // default api to list all products
    axios
      .get(`${this.baseUrl}/products/list`)
      .then((response) => {
        this.items = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });

    // get the categories list dynamically
    axios
      .get(`${this.baseUrl}/categories/list`)
      .then((response) => {
        this.categories = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  };
</script>

<style scoped>
.rlink {
  text-decoration: none;
  cursor: pointer;
}
a.link {
  text-decoration: none;
}

a.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #6c95e2;
  color: #fff;
  text-decoration: none;
  border-radius: 25px;
}

.sort {
  margin:5px;
}
a.button:hover {
  background-color: #3e8e41;
}
</style>
