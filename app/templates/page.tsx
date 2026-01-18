"use client";

import React, { useState, useMemo } from "react";
import { Fade } from "react-awesome-reveal";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  resumeTemplates,
  templateCategories,
  categoryDisplayNames,
  type CategoryKey,
} from "../../data/resume-templates";
import { TemplateCard } from "../../components/elements/TemplateCard";
import { CreateOwnTemplateCard } from "../../components/elements/CreateOwnTemplateCard";
import { HomeHeaderBar } from "../../components/elements/HomeHeaderBar";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

export const metadata = {
  title: "Templates",
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(
    Object.keys(templateCategories) as CategoryKey[]
  );

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      "tech-engineering": templateCategories["tech-engineering"].length,
      "business-analytics": templateCategories["business-analytics"].length,
      "design-media": templateCategories["design-media"].length,
      "health-service": templateCategories["health-service"].length,
    };
    return counts;
  }, []);

  // Filter templates based on search and categories
  const filteredTemplates = useMemo(() => {
    return resumeTemplates.filter((template) => {
      // Search filter (by name, case-insensitive)
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.some((category) =>
        templateCategories[category].includes(template.id as never)
      );

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  // Handle category toggle
  const toggleCategory = (category: CategoryKey) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Remove category
        const newCategories = prev.filter((c) => c !== category);
        // If no categories selected, select all
        return newCategories.length === 0
          ? (Object.keys(templateCategories) as CategoryKey[])
          : newCategories;
      } else {
        // Add category
        return [...prev, category];
      }
    });
  };

  // Handle "All" toggle
  const toggleAll = () => {
    const allCategories = Object.keys(templateCategories) as CategoryKey[];
    if (selectedCategories.length === allCategories.length) {
      // Deselect all (but keep at least one selected by selecting all again)
      setSelectedCategories(allCategories);
    } else {
      // Select all
      setSelectedCategories(allCategories);
    }
  };

  const allSelected =
    selectedCategories.length === Object.keys(templateCategories).length;

  return (
    <div className="relative min-h-screen bg-[#101113] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#11131a] via-[#0d0e12] to-[#09090b]" />

      {/* Header Bar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <HomeHeaderBar />
      </div>

      <main className="relative z-10 px-4 py-20 sm:px-6 lg:px-8 pt-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-16">
          {/* Title Section */}
          <Fade direction="down" duration={600} triggerOnce>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Choose Your Template
              </h1>
              <p className="text-lg text-[#cfd3e1] sm:text-xl max-w-2xl mx-auto">
                Select the resume template that best fits your field of study
                and career goals.
              </p>
            </div>
          </Fade>

          {/* Create Your Own Template Card */}
          <Fade duration={800} delay={0} triggerOnce>
            <div className="flex justify-center w-1/3 mx-auto">
              <CreateOwnTemplateCard />
            </div>
          </Fade>

          {/* Premade Templates Section */}
          <div className="space-y-6">
            <Fade direction="up" duration={600} triggerOnce>
              <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4">
                <div className="w-1/3 "></div>
                {/* Title and Description */}

                <div className="w-1/3 flex flex-col items-center">
                  
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                      Major Specific Templates
                    </h2>
                    <p className="text-sm text-[#6d7895] mt-2 text-center">
                      Professionally designed templates for specific fields and
                      majors
                    </p>
                  
                </div>

                {/* Search and Filter Controls */}
                <div className="w-1/3 flex items-center justify-end gap-2">
                  {/* Search Bar */}
                  <div className="relative flex">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7895]" />
                    <Input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-50 bg-[#1a1c22]/50 border-[#2d313a] text-white placeholder:text-[#6d7895] focus-visible:border-[#3d4353]"
                    />
                  </div>

                  {/* Filter Button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-[#1a1c22]/50 border-[#2d313a] text-[#6d7895] hover:text-white hover:bg-[#1c1d21]/90 hover:border-[#3d4353]"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 bg-[#1c1d21] border-[#2d313a] text-white p-4"
                      align="start"
                    >
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-white mb-2">
                          Filter by Category
                        </div>
                        {/* All Option */}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="all"
                            checked={allSelected}
                            onCheckedChange={toggleAll}
                            className="border-[#2d313a] data-[state=checked]:bg-[#274cbc] data-[state=checked]:border-[#274cbc]"
                          />
                          <label
                            htmlFor="all"
                            className="text-sm text-[#cfd3e1] cursor-pointer flex-1"
                          >
                            All
                          </label>
                        </div>
                        {/* Category Options */}
                        {(Object.keys(templateCategories) as CategoryKey[]).map(
                          (category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                                className="border-[#2d313a] data-[state=checked]:bg-[#274cbc] data-[state=checked]:border-[#274cbc]"
                              />
                              <label
                                htmlFor={category}
                                className="text-sm text-[#cfd3e1] cursor-pointer flex-1"
                              >
                                {categoryDisplayNames[category]} (
                                {categoryCounts[category]})
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Fade>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, index) => (
                  <Fade
                    key={template.id}
                    direction="up"
                    duration={800}
                    delay={index * 100}
                    triggerOnce
                  >
                    <TemplateCard template={template} />
                  </Fade>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6d7895] text-lg">
                  No templates found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
