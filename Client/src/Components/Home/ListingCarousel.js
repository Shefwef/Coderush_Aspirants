import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Placeholder from "./images/placeholder.jpeg";

const settings = {
  dots: false,
  arrows: true,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

export default function ListingCarousel() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios
      .get("/api/listings?featured=true&limit=8")
      .then((r) => setListings(r.data))
      .catch(() => setListings([]));
  }, []);

  return (
    <section className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>
      <Slider {...settings}>
        {(listings.length ? listings : Array(4).fill({})).map((item, i) => {
          const img = item.images?.[0] || Placeholder;
          return (
            <Link
              key={item._id || i}
              to={item._id ? `/listings/${item._id}` : "/listings"}
            >
              <div className="p-2">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={img}
                    alt={item.title || "…"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {item.title || "Loading…"}
                    </h3>
                    <p className="text-indigo-600 font-bold mt-2">
                      {item.price
                        ? `${item.price.amount} ${item.price.currency}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>
    </section>
  );
}
