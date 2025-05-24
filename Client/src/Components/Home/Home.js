import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "./images/marketplace-hero.jpg";
import CardBelowHome from "./CardBelowHome";
import ListingCarousel from "./ListingCarousel";
import { Button } from "../ui/Button";

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="container mx-auto flex flex-col md:flex-row items-center gap-8 py-16">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Student-Driven Marketplace
          </h1>
          <p className="text-gray-600">
            Buy, sell, or swap textbooks, gadgets, bikes, and tutoring—securely
            with your campus network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/listings/create">
              <Button variant="primary">Sell an Item</Button>
            </Link>
            <Link to="/listings">
              <Button variant="outline">Browse Listings</Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src={HeroImage}
            alt="Students exchanging items"
            className="rounded-lg shadow-lg object-cover w-full"
          />
        </div>
      </section>

      <CardBelowHome />
      <ListingCarousel />
    </div>
  );
}
