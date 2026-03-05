import axios from "axios";
interface Event {
  body: {
    query: string;
  };
}
interface GiphyAPiResponse {
  data: {
    images: {
      original: {
        url: string;
      };
    };
  }[];
}
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
if (!GIPHY_API_KEY) {
  throw new Error("GIPHY_API_KEY is not defined in environment variables");
}
export const handler = async (event: Event) => {
  let query: string;
  try {
    query = event.body.query;
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Query parameter is required" }),
    };
  }
  try {
    const url = new URL("https://api.giphy.com/v1/gifs/search");
    url.searchParams.set("q", query);
    url.searchParams.set("api_key", GIPHY_API_KEY);
    url.searchParams.set("limit", "1");
    const { data } = await axios.get<GiphyAPiResponse>(url.toString());
    const imageUrl = data.data[0].images.original.url;
    if (!imageUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No GIF found for the given query" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl }),
    };
  } catch (error) {
    console.error("Failed to fetch GIF", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while fetching the GIF",
      }),
    };
  }
};
