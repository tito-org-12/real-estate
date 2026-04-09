import {
  Building2,
  Check,
  House,
  LandPlot,
  type LucideIcon,
  MapPin,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  LOCATION_OPTIONS,
  PROPERTY_TYPES,
  ROOM_OPTIONS,
  type LocationOption,
  type PropertyTypeFilter,
  type RoomFilter,
  type SortFilter,
} from "./listings-browser.types";

function RoomOptionCard({
  active,
  label,
  onClick,
}: Readonly<{
  active: boolean;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`h-10 rounded-md text-xs font-medium transition-colors ${
        active
          ? "bg-[#4860f4] text-white"
          : "bg-[#efeff1] text-[#5f6370] hover:bg-[#e6e7eb]"
      }`}
    >
      {label}
    </button>
  );
}

const PROPERTY_TYPE_ICONS: Record<PropertyTypeFilter, LucideIcon> = {
  all: House,
  house: House,
  apartment: Building2,
  commercial: Store,
  land: LandPlot,
};

function PropertyTypeCard({
  active,
  label,
  value,
  onClick,
}: Readonly<{
  active: boolean;
  label: string;
  value: PropertyTypeFilter;
  onClick: () => void;
}>) {
  const Icon = PROPERTY_TYPE_ICONS[value];

  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex h-20 flex-col items-center justify-center gap-2 rounded-xl border text-center text-[11px] font-medium transition-colors ${
        active
          ? "border-[#4860f4] bg-[#4860f4] text-white"
          : "border-transparent bg-[#ececf0] text-[#51545f] hover:border-[#4860f4]/30"
      }`}
    >
      <Icon className='h-4 w-4' />
      <span className='leading-tight'>{label}</span>
    </button>
  );
}

const SORT_OPTIONS: Array<{ label: string; value: SortFilter }> = [
  { label: "Recommended", value: "recommended" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

function SortCheckboxOption({
  active,
  label,
  onClick,
}: Readonly<{
  active: boolean;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex w-full items-center gap-2.5 rounded-md py-0.5 text-left text-sm text-[#5f6370] transition-colors hover:text-[#3f434e]'
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-md border ${
          active
            ? "border-[#4860f4] bg-[#4860f4] text-white"
            : "border-[#e6e7eb] bg-[#f4f5f7] text-transparent"
        }`}
      >
        <Check className='h-2.5 w-2.5' />
      </span>
      <span className='text-[14px] leading-5'>{label}</span>
    </button>
  );
}

export function ListingsFiltersPanel({
  type,
  sortBy,
  priceRange,
  selectedRooms,
  selectedLocation,
  setType,
  setSortBy,
  setPriceRange,
  setSelectedRooms,
  setSelectedLocation,
  clearAll,
}: Readonly<{
  type: PropertyTypeFilter;
  sortBy: SortFilter;
  priceRange: [number, number];
  selectedRooms: RoomFilter;
  selectedLocation: LocationOption;
  setType: (value: PropertyTypeFilter) => void;
  setSortBy: (value: SortFilter) => void;
  setPriceRange: (value: [number, number]) => void;
  setSelectedRooms: (value: RoomFilter) => void;
  setSelectedLocation: (value: LocationOption) => void;
  clearAll: () => void;
}>) {
  return (
    <aside className='border-border/60 bg-[#f7f7f8] px-6 py-8 lg:border-r'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-foreground'>Filters</h2>
      </div>

      <div className='space-y-8'>
        <div className='space-y-3'>
          <Label className='text-sm font-medium text-foreground'>
            Property type
          </Label>
          <div className='grid grid-cols-2 gap-3'>
            {PROPERTY_TYPES.map((option) => (
              <PropertyTypeCard
                key={option.value}
                active={type === option.value}
                label={option.label}
                value={option.value}
                onClick={() => setType(option.value)}
              />
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <Label className='text-sm font-medium text-foreground'>
            Location
          </Label>
          <Select
            value={selectedLocation}
            onValueChange={(value) =>
              setSelectedLocation(value as LocationOption)
            }
          >
            <SelectTrigger className='h-10 w-full rounded-xl border-transparent bg-[#efeff1] px-3 text-xs text-[#7c8088] hover:bg-[#e7e8ec]'>
              <div className='flex min-w-0 items-center gap-2'>
                <MapPin className='h-3.5 w-3.5 text-[#8f939d]' />
                <SelectValue
                  placeholder='Select location'
                  className='min-w-0'
                />
              </div>
            </SelectTrigger>
            <SelectContent className='rounded-xl border border-border/60 bg-white'>
              {LOCATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3'>
          <Label className='text-sm font-medium text-foreground'>
            Price range
          </Label>
          <div className='space-y-4 rounded-xl bg-transparent py-1'>
            <Slider
              min={0}
              max={100000}
              step={500}
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              className='py-1 **:data-[slot=slider-track]:h-0.5 **:data-[slot=slider-track]:rounded-full **:data-[slot=slider-track]:bg-[#c7c8cd] **:data-[slot=slider-range]:bg-[#4860f4] **:data-[slot=slider-thumb]:size-2.5 **:data-[slot=slider-thumb]:rounded-full **:data-[slot=slider-thumb]:border-0 **:data-[slot=slider-thumb]:bg-[#4860f4] **:data-[slot=slider-thumb]:after:-inset-1.5'
            />

            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <div className='rounded-md bg-[#efeff1] py-2 text-xs font-medium text-[#4f5360]'>
                  ${Math.round(priceRange[0])}
                </div>
                <div className='mt-1 text-xs text-[#8a8d95]'>min</div>
              </div>

              <div className='text-center'>
                <div className='rounded-md bg-[#efeff1] py-2 text-xs font-medium text-[#4f5360]'>
                  ${Math.round(priceRange[1])}
                </div>
                <div className='mt-1 text-xs text-[#8a8d95]'>max</div>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          <Label className='text-sm font-medium text-foreground'>Rooms</Label>
          <div className='grid grid-cols-4 gap-2'>
            {ROOM_OPTIONS.map((room) => (
              <RoomOptionCard
                key={room}
                active={selectedRooms === room}
                label={room === 4 ? "4+" : String(room)}
                onClick={() => setSelectedRooms(room)}
              />
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <Label className='text-sm font-medium text-foreground'>Sort by</Label>
          <div className='space-y-2'>
            {SORT_OPTIONS.map((option) => (
              <SortCheckboxOption
                key={option.value}
                active={sortBy === option.value}
                label={option.label}
                onClick={() => setSortBy(option.value)}
              />
            ))}
          </div>
        </div>

        <Button
          type='button'
          className='h-10 w-full rounded-lg border border-[#3f56de] bg-[#4860f4] text-sm font-medium text-white hover:bg-[#3f56de]'
          onClick={clearAll}
        >
          Clear all
        </Button>
      </div>
    </aside>
  );
}
