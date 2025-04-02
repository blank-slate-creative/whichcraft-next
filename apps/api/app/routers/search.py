from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
import requests

from ..schemas import BeerSearchResult, VenueSearchResult

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("/beer", response_model=List[BeerSearchResult])
async def search_beer(q: str = Query(..., description="Search term")):
    """
    Search for beers using Untappd's Algolia search.
    """
    if not q:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Search term is required"
        )

    try:
        # Untappd Algolia search endpoint
        url = "https://9wbo4rq3ho-dsn.algolia.net/1/indexes/beer/query"

        # Headers required for the Algolia API
        headers = {
            "Content-Type": "application/json",
            "X-Algolia-API-Key": "1d347324d67ec472bb7132c66aead485",
            "X-Algolia-Application-ID": "9WBO4RQ3HO",
        }

        # Prepare the search payload
        payload = {
            "query": q,
            "hitsPerPage": 10,  # Limit results to 10
        }

        # Make the request to Algolia
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors

        data = response.json()

        # Transform the response to match our expected format
        if "hits" in data:
            transformed_results = []

            for hit in data["hits"]:
                transformed_results.append(
                    BeerSearchResult(
                        id=hit.get("bid", 0),
                        name=hit.get("beer_name", ""),
                        type_name=hit.get("type_name", ""),
                        rating=hit.get("rating_score", 0),
                        rating_count=hit.get("rating_count", 0),
                        image_url=hit.get("beer_label", ""),
                        abv=hit.get("beer_abv", 0),
                        brewery_name=hit.get("brewery_name", "Unknown Brewery"),
                        brewery_id=hit.get("brewery_id"),
                    )
                )

            return transformed_results
        else:
            return []

    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching for beers: {str(e)}",
        )


@router.get("/venue", response_model=List[VenueSearchResult])
async def search_venue(
    q: str = Query(..., description="Search term"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lng: Optional[float] = Query(None, description="Longitude"),
):
    """
    Search for venues using Untappd's Algolia search.
    """
    if not q:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Search term is required"
        )

    try:
        # Untappd Algolia search endpoint
        url = "https://9wbo4rq3ho-dsn.algolia.net/1/indexes/venue/query"

        # Headers required for the Algolia API
        headers = {
            "Content-Type": "application/json",
            "X-Algolia-API-Key": "1d347324d67ec472bb7132c66aead485",
            "X-Algolia-Application-ID": "9WBO4RQ3HO",
        }

        # Prepare the search payload
        payload = {
            "params": f"query={q}&hitsPerPage=10&filters=is_testing_venue:0 AND is_hidden:0"
        }

        # Add geolocation if provided
        if lat and lng:
            payload["params"] += f"&aroundLatLng={lat},{lng}"
        else:
            payload["params"] += "&aroundLatLngViaIP=true"

        # Make the request to Algolia
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors

        data = response.json()

        # Transform the response to match our expected format
        if "hits" in data:
            transformed_results = []

            for hit in data["hits"]:
                transformed_results.append(
                    VenueSearchResult(
                        id=str(hit.get("venue_id", "")),
                        name=hit.get("venue_name", ""),
                        primary_category=hit.get("venue_primary_category", ""),
                        categories=hit.get("venue_categories", []),
                        address=hit.get("venue_address", ""),
                        city=hit.get("venue_city", ""),
                        state=hit.get("venue_state", ""),
                        country=hit.get("venue_country", ""),
                        coordinates={
                            "latitude": hit.get("_geoloc", {}).get("lat", 0),
                            "longitude": hit.get("_geoloc", {}).get("lng", 0),
                        },
                        image_url=hit.get("venue_picture"),
                        has_beer=bool(hit.get("has_beer", 0)),
                        has_food=bool(hit.get("has_food", 0)),
                        has_wine=bool(hit.get("has_wine", 0)),
                        has_spirits=bool(hit.get("has_spirits", 0)),
                    )
                )

            return transformed_results
        else:
            return []

    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching for venues: {str(e)}",
        )
