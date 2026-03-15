"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trackPhase0Event } from "@/lib/analytics";
import { getTransformedUrl } from "@/lib/cloudinary";
import { createPropertyImageDataAccess } from "@/lib/storage/property-image-data-access";
import { PILOT_CITY, PILOT_CURRENCY_CODE } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

type ListingType = "apartment" | "house" | "villa" | "studio";
const propertyImageDataAccess = createPropertyImageDataAccess();

export function CreateListingForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [listingType, setListingType] = useState<ListingType>("apartment");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePublicId, setImagePublicId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    imageUrl: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    neighborhood: "",
    phone: "",
    whatsapp: "",
  });

  // Auto-fill whatsapp from session when session loads
  useEffect(() => {
    const whatsapp = (session?.user as any)?.whatsapp;
    if (whatsapp && !formData.whatsapp) {
      setFormData((prev) => ({ ...prev, whatsapp }));
    }
  }, [(session?.user as any)?.whatsapp]);

  const createMutation = useMutation(
    orpc.listings.create.mutationOptions({
      onSuccess: () => {
        trackPhase0Event("listing_create_succeeded", {
          type: listingType,
          location: formData.location,
        });
        toast.success("Listing created successfully!");
        router.push("/listings");
      },
      onError: (err) => {
        toast.error(`Failed to create listing: ${err.message}`);
        trackPhase0Event("listing_create_failed", {
          type: listingType,
          reason: err.message,
        });
        setLoading(false);
      },
    }),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingImage(true);

    try {
      const uploaded = await propertyImageDataAccess.uploadPropertyImage(file);
      setFormData((previous) => ({ ...previous, imageUrl: uploaded.url }));
      setImagePublicId(uploaded.publicId);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed";
      toast.error(message);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingImage) {
      toast.error("Please wait until the image upload finishes.");
      return;
    }

    trackPhase0Event("listing_create_started", { type: listingType });

    const title = formData.title.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const neighborhood = formData.neighborhood.trim();
    const phone = formData.phone.trim();
    const whatsapp = formData.whatsapp.trim();
    const parsedPrice = Number.parseFloat(formData.price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter a valid monthly rent amount.");
      return;
    }

    const bedrooms = Number.parseInt(formData.bedrooms, 10);
    const bathrooms = Number.parseFloat(formData.bathrooms);
    const sqft = Number.parseInt(formData.sqft, 10);

    const hasInvalidHomeDetails = [bedrooms, bathrooms, sqft].some((value) =>
      Number.isNaN(value),
    );

    if (hasInvalidHomeDetails) {
      toast.error("Please complete bedrooms, bathrooms, and area fields.");
      return;
    }

    setLoading(true);

    const priceInCents = Math.floor(parsedPrice * 100);
    const images = formData.imageUrl ? [formData.imageUrl] : [];

    const meta = {
      bedrooms,
      bathrooms,
      sqft,
      neighborhood: formData.neighborhood,
      ...(phone ? { phone } : {}),
      ...(whatsapp ? { whatsapp } : {}),
      ...(imagePublicId ? { imagePublicId } : {}),
    };

    createMutation.mutate({
      title,
      price: priceInCents,
      type: listingType,
      description,
      location,
      images: images,
      meta: {
        ...meta,
        neighborhood,
      },
    });
  };

  return (
    <Card className='mx-auto w-full max-w-3xl border-border/60 shadow-md'>
      <CardHeader className='space-y-1 border-border/40 border-b pb-8 text-center'>
        <CardTitle className='font-serif text-3xl'>
          Create Rental Listing
        </CardTitle>
        <CardDescription className='font-medium text-xs uppercase tracking-widest'>
          Publish a rental home in {PILOT_CITY}
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-8'>
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Property Type Selector */}
          <div className='space-y-4'>
            <Label className='block text-center font-medium text-muted-foreground text-xs uppercase tracking-widest'>
              Property Type
            </Label>
            <div className='mx-auto flex max-w-md justify-center rounded-lg bg-muted/40 p-1'>
              <button
                type='button'
                onClick={() => setListingType("apartment")}
                className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${listingType === "apartment" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Apartment
              </button>
              <button
                type='button'
                onClick={() => setListingType("house")}
                className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${listingType === "house" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                House
              </button>
              <button
                type='button'
                onClick={() => setListingType("villa")}
                className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${listingType === "villa" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Villa
              </button>
              <button
                type='button'
                onClick={() => setListingType("studio")}
                className={`flex-1 rounded-md py-2 font-medium text-sm transition-all duration-300 ${listingType === "studio" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Studio
              </button>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='border-border/40 border-b pb-2 font-serif text-xl'>
                Basic Information
              </h3>

              <div className='space-y-2'>
                <Label
                  htmlFor='title'
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Title
                </Label>
                <Input
                  id='title'
                  name='title'
                  placeholder='e.g. Modern Apartment in Downtown'
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                />
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='price'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Monthly Rent ({PILOT_CURRENCY_CODE})
                  </Label>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    placeholder='4500'
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='location'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Location
                  </Label>
                  <Input
                    id='location'
                    name='location'
                    placeholder={`${PILOT_CITY}, Kacyiru`}
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='imageFile'
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Property Image
                </Label>
                <Input
                  id='imageFile'
                  name='imageFile'
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={
                    uploadingImage || loading || createMutation.isPending
                  }
                  className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                />
                <p className='text-muted-foreground text-xs'>
                  {uploadingImage
                    ? "Uploading image..."
                    : "Upload from your device (stored securely via backend -> Cloudinary)."}
                </p>
                {imagePublicId &&
                  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                    <img
                      src={getTransformedUrl(imagePublicId, {
                        width: 960,
                        height: 640,
                        crop: "fill",
                      })}
                      alt='Uploaded property preview'
                      className='mt-3 h-40 w-full rounded-md border border-border/50 object-cover'
                    />
                  )}
                {!imagePublicId && formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt='Uploaded property preview'
                    className='mt-3 h-40 w-full rounded-md border border-border/50 object-cover'
                  />
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='imageUrl'
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Image URL (optional override)
                </Label>
                <Input
                  id='imageUrl'
                  name='imageUrl'
                  placeholder='https://...'
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                />
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='description'
                  className='text-muted-foreground text-xs uppercase tracking-wider'
                >
                  Description
                </Label>
                <Textarea
                  id='description'
                  name='description'
                  placeholder='Describe bedrooms, amenities, availability, and tenant fit...'
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className='min-h-25 resize-y border-border/60 bg-muted/20 focus:border-primary/50'
                />
              </div>
            </div>

            <div className='animate-fade-in space-y-4'>
              <h3 className='border-border/40 border-b pb-2 font-serif text-xl'>
                Home Details
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='bedrooms'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Bedrooms
                  </Label>
                  <Input
                    id='bedrooms'
                    name='bedrooms'
                    type='number'
                    required
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='bathrooms'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Bathrooms
                  </Label>
                  <Input
                    id='bathrooms'
                    name='bathrooms'
                    type='number'
                    step='0.5'
                    required
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='sqft'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Area (sqft)
                  </Label>
                  <Input
                    id='sqft'
                    name='sqft'
                    type='number'
                    required
                    value={formData.sqft}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='neighborhood'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Neighborhood
                  </Label>
                  <Input
                    id='neighborhood'
                    name='neighborhood'
                    placeholder='Al Olaya'
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='phone'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    Contact Phone (optional)
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='+250788123456'
                    value={formData.phone}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='whatsapp'
                    className='text-muted-foreground text-xs uppercase tracking-wider'
                  >
                    WhatsApp Number (optional)
                  </Label>
                  <Input
                    id='whatsapp'
                    name='whatsapp'
                    type='tel'
                    placeholder='+250788123456'
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className='h-10 border-border/60 bg-muted/20 focus:border-primary/50'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='pt-4'>
            <Button
              type='submit'
              className='h-11 w-full font-semibold text-xs uppercase tracking-widest'
              disabled={loading || createMutation.isPending || uploadingImage}
            >
              {createMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Publish Listing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
