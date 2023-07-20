export const useLocation = () =>
  useState<{ latitude: number; longitude: number; city: string }>(
    "location",
    () => useDefaultLocation().value,
  );

export const useDefaultLocation = (
  fallback = { latitude: 59.3294, longitude: 18.0687, city: "Stockholm" },
) => {
  const location = ref(fallback);
  if (process.server) {
    const { ssrContext } = useNuxtApp();
    const loc = ssrContext?.event.context.location;
    if (loc) {
      location.value = loc;
    }
  }
  return location;
};
