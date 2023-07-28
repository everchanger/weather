<template>
  <div class="hello">
    <div class="current flex flex-col">
      <h2>{{ city }}</h2>
      <p class="temperature">{{ weather.current_weather.temperature }}°C</p>
      <p class="windspeed">{{ windSpeedMs }} m/s</p>
      <div class="flex items-center">
        <img
          alt="An icon showing the current weather"
          :src="icon"
          class="icon"
        />
        <div class="flex flex-col">
          <img
            alt="An icon showing the current Beauford scale value"
            :src="windIcon"
            class="icon wind"
          />
          <p class="text-xs text-center">
            Animation shows
            <a
              title="Read more about the Beauford scale"
              href="https://en.wikipedia.org/wiki/Beaufort_scale"
              >Beaufortscale</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Weather = {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
};

const defaultLocation = {
  latitude: 59.3294,
  longitude: 18.0687,
};

const location = useCookie("location", {
  default: () => defaultLocation,
});

if (!location.value.latitude || !location.value.longitude) {
  location.value = defaultLocation;
}

const { data: weather }: { data: Ref<Weather> } = await useAsyncData(
  "weather",
  () =>
    $fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.value.latitude}&longitude=${location.value.longitude}&current_weather=true`,
    ),
  { watch: [location] },
);

const { data: city } = await useAsyncData(
  "city",
  () =>
    $fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.value.latitude}&lon=${location.value.longitude}&format=json`,
    ),
  {
    transform: (data: any) =>
      data.display_name.split(",").slice(0, 2).join(", "),
    watch: [location],
  },
);

const windSpeedMs = computed(() =>
  (weather.value.current_weather.windspeed * (5 / 18)).toFixed(1),
);

const icon = computed(() => {
  const code = weather.value.current_weather.weathercode;
  switch (code) {
    case 0:
      // Clear sky
      return "/icons/line/clear-day.svg";
    case 1:
    case 2:
    case 3:
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
  return "/icons/line/cloudy.svg";
});

const beaufort = computed(() => {
  const scale = {
    "0": 1,
    "1": 6,
    "2": 12,
    "3": 20,
    "4": 29,
    "5": 39,
    "6": 50,
    "7": 62,
    "8": 75,
    "9": 89,
    "10": 103,
    "11": 119,
    "12": 221,
  };

  const windspeed = weather.value.current_weather.windspeed;
  for (const [key, value] of Object.entries(scale)) {
    if (windspeed < value) {
      return key;
    }
  }
  return "0";
});

const windIcon = computed(
  () => `/icons/line/wind-beaufort-${beaufort.value}.svg`,
);

onMounted(() => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    location.value = { latitude, longitude };
  });
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
}
.icon {
  border-radius: 50%;
  align-self: center;
  width: 12rem;
  height: 12rem;
}

.wind {
  width: 6rem;
  height: 6rem;
  margin: 0;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.current {
  gap: 0.5rem;
}

.current .temperature {
  font-size: 3rem;
  font-weight: bold;
}

.current .windspeed {
  font-size: 1.5rem;
  font-weight: normal;
}

.text-xs {
  font-size: 0.75rem;
  font-weight: normal;
}

.text-center {
  text-align: center;
}
</style>
