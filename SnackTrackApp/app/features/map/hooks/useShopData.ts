import { useEffect, useState } from "react";
import { Shop } from "../types/map";


/**
* Loads shops from API with a local JSON fallback for demos.
* Replace `fallback` with a real fetch to your backend when ready.
*/
export function useShopData() {
const [shops, setShops] = useState<Shop[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);


useEffect(() => {
let active = true;
async function load() {
try {
// TODO: Swap with real API call, e.g. fetch("/api/shops")
const fallback = await import("../data/shops.json");
if (!active) return;
setShops(fallback.default as Shop[]);
} catch (e: any) {
setError(e?.message ?? "Failed to load shops");
} finally {
setLoading(false);
}
}
load();
return () => {
active = false;
};
}, []);


return { shops, loading, error };
}