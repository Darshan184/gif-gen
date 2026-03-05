"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const axios_1 = __importDefault(require("axios"));
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
if (!GIPHY_API_KEY) {
    throw new Error("GIPHY_API_KEY is not defined in environment variables");
}
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    try {
        query = event.body.query;
    }
    catch (_a) {
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
        const { data } = yield axios_1.default.get(url.toString());
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
    }
    catch (error) {
        console.error("Failed to fetch GIF", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "An error occurred while fetching the GIF",
            }),
        };
    }
});
exports.handler = handler;
