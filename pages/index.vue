<template>
  <div class="hello">
    <h2>{{ city }}</h2>
    <div class="flex">
      <p>{{ weather?.current_weather?.temperature }} °C</p>
      <img :src="icon" class="icon" />
      {{ weather?.current_weather }}
    </div>
  </div>
</template>

<script lang="ts" setup>
type Location = {
  latitude: number;
  longitude: number;
};

const weather = ref(null);
const location = useLocation();
const getWeather = ({ latitude, longitude }: Location) =>
  $fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
  );

const getCity = ({ latitude, longitude }: Location) =>
  $fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
  );

const weatherPromise = await useAsyncData(
  "weather",
  () => getWeather(location.value),
  { watch: location },
);

// How do we handle this?
weather.value = weatherPromise.data.value;

const { data: city } = await useAsyncData(
  "city",
  () => getCity(location.value),
  {
    transform: (data) => data.display_name.split(",").slice(0, 2).join(", "),
    watch: location,
  },
);

const icon = computed(() => {
  const code = weather?.value?.current_weather?.weatchercode;
  console.log("calculating", { code });
  switch (code) {
    case 0:
      // Clear sky
      return "/icons/line/sun.svg";
    case 1:
    case 2:
    case 3:
      console.log("here");
      // Mainly clear, partly cloudy, and overcast
      return "/icons/line/cloudy.svg";
    case 45:
    case 48:
      // Fog
      return "/icons/line/fog.svg";
    case 51:
    case 53:
    case 55:
      // Drizzle: Light, moderate, and dense intensity
      return "/icons/line/rain.svg";
    case 56:
    case 57:
    case 58:
      // Freezing Drizzle: Light and dense intensity
      return "/icons/line/rain.svg";
    case 61:
    case 63:
    case 65:
      // Rain: Slight, moderate and heavy intensity
      return "/icons/line/rain.svg";
    case 66:
    case 67:
    case 68:
      // Freezing Rain: Light and heavy intensity
      return "/icons/line/rain.svg";
    case 71:
    case 73:
    case 75:
      // Snow fall: Slight, moderate, and heavy intensity
      return "/icons/line/snow.svg";
    case 77:
    case 78:
      // Snow grains: Light and heavy intensity
      return "/icons/line/snow.svg";
    case 80:
    case 81:
    case 82:
      // Rain showers: Slight, moderate and volent
      return "/icons/line/rain.svg";
    case 85:
    case 86:
      // Snow showers slight and heavy
      return "/icons/line/snow.svg";
    case 95:
      // Thunderstorm: Slight or moderate
      return "/icons/line/thunderstorm.svg";
    case 96:
    case 99:
      // Thunderstorm with slight and heavy hail
      return "/icons/line/thunderstorm.svg";
  }
  console.log("no weather code");
  return "/icons/line/cloudy.svg";
});

onMounted(() => {
  // navigator.geolocation.getCurrentPosition((pos) => {
  //   location.value = pos.coords;
  // });
});
</script>
```

<style scoped>
.hello {
  padding: 1rem;
  color: var(--wenge);
  font-size: 1rem;
  font-weight: bold;
}

h2 {
  font-size: 2rem;
  font-weight: normal;
  margin: 0;
}
.icon {
  width: 12rem;
  height: 12rem;
  margin: 0.5rem 0;
}

.flex {
  display: flex;
}
</style>
