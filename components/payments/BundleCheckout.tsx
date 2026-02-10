        window.location.href = data.checkoutUrl;
      } else {
        // Free enrollment successful
        toast.success("Successfully enrolled in bundle!");
        setLocation("/my-courses");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process enrollment");
    },
  });

  // Coupon validation
  const validateCouponMutation = trpc.courses.validateCoupon.useMutation();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      const result = await validateCouponMutation.mutateAsync({
        code: couponCode.trim(),
        courseId: bundleId!, // Using bundleId for validation
      });
      
      if (result.valid) {
        setAppliedCoupon(result);
        toast.success(`Coupon applied! ${result.discountPercent}% off`);
      } else {
        toast.error(result.message || "Invalid coupon code");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!bundleId) return;
    
    enrollMutation.mutate({
      bundleId,
      duration: selectedDuration,
      couponCode: appliedCoupon ? couponCode : undefined,
    });
  };

  // Get price for selected duration
  const getPrice = () => {
    if (!bundle?.pricing) return 0;
    const option = durationOptions.find(o => o.value === selectedDuration);
    if (!option) return bundle.pricing.oneTime || 0;
    return bundle.pricing[option.priceKey] || bundle.pricing.oneTime || 0;
  };

  // Calculate final price with coupon
  const getFinalPrice = () => {
    const basePrice = getPrice();
    if (appliedCoupon?.discountPercent) {