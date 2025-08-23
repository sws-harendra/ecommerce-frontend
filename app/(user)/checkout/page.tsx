"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Check,
  Home,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  selectCart,
  clearCart,
  selectCartItemsCount,
} from "@/app/lib/store/features/cartSlice";
import { RootState, useAppSelector } from "@/app/lib/store/store";
import Link from "next/link";
import { getImageUrl } from "@/app/utils/getImageUrl";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface FormData {
  email: string;
  fullname: string;
  // lastName: string;
  phone: string;
  selectedAddressId: string;
  newAddress: {
    type: "home" | "work" | "other";
    name: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveInfo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector(selectCart);
  const totalItems = useSelector(selectCartItemsCount);
  const { isAuthenticated, status, user } = useAppSelector(
    (state: RootState) => state.auth
  );

  // Mock addresses - In real app, fetch from profile slice
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      name: "Home",
      address: "123 Main Street",
      apartment: "Apt 2B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true,
    },
    {
      id: "2",
      type: "work",
      name: "Work",
      address: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      isDefault: false,
    },
  ]);
  const isLoading = status === "loading";
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: user?.email || "",
    fullname: user?.fullname || "",
    // lastName: user?.lastName || "",
    phone: user?.phoneNumber || "",
    selectedAddressId: savedAddresses.find((addr) => addr.isDefault)?.id || "",
    newAddress: {
      type: "home",
      name: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
    },
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveInfo: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate order totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name.startsWith("newAddress.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        newAddress: {
          ...formData.newAddress,
          [addressField]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";

      if (!formData.fullname) newErrors.fullname = "First name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }

    if (step === 2) {
      if (!showAddressForm && !formData.selectedAddressId) {
        newErrors.address = "Please select an address or add a new one";
      }
      if (showAddressForm) {
        if (!formData.newAddress.name)
          newErrors["newAddress.name"] = "Address name is required";
        if (!formData.newAddress.address)
          newErrors["newAddress.address"] = "Address is required";
        if (!formData.newAddress.city)
          newErrors["newAddress.city"] = "City is required";
        if (!formData.newAddress.state)
          newErrors["newAddress.state"] = "State is required";
        if (!formData.newAddress.zipCode)
          newErrors["newAddress.zipCode"] = "ZIP code is required";
      }
    }

    if (step === 3) {
      if (!formData.cardNumber)
        newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      if (!formData.cardName) newErrors.cardName = "Name on card is required";

      if (!formData.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Format must be MM/YY";
      }

      if (!formData.cvv) newErrors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(formData.cvv))
        newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const generateOrderId = () => {
    return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const handlePlaceOrder = async () => {
    if (validateStep(3)) {
      setIsProcessing(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newOrderId = generateOrderId();
        setOrderId(newOrderId);
        setOrderSuccess(true);
        dispatch(clearCart());
      } catch (error) {
        console.error("Order placement failed:", error);
        alert("Order placement failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddNewAddress = () => {
    if (validateStep(2)) {
      const newAddress: Address = {
        id: Date.now().toString(),
        type: formData.newAddress.type,
        name: formData.newAddress.name,
        address: formData.newAddress.address,
        apartment: formData.newAddress.apartment,
        city: formData.newAddress.city,
        state: formData.newAddress.state,
        zipCode: formData.newAddress.zipCode,
        isDefault: savedAddresses.length === 0,
      };

      setSavedAddresses([...savedAddresses, newAddress]);
      setFormData({ ...formData, selectedAddressId: newAddress.id });
      setShowAddressForm(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link href="/">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Your order ID is:{" "}
            <span className="font-bold text-green-600">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={() => setOrderSuccess(false)}
              className="bg-white text-green-600 border-2 border-green-200 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300"
            >
              View Order Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/cart">
            <button className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </button>
          </Link>
          <div className="text-sm text-gray-600 bg-white px-6 py-3 rounded-2xl shadow-md">
            <Lock className="w-4 h-4 inline mr-2 text-green-500" />
            Secure SSL Encrypted Checkout
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Secure checkout in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Enhanced Progress Steps */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                {[
                  { step: 1, title: "Contact", icon: User },
                  { step: 2, title: "Shipping", icon: MapPin },
                  { step: 3, title: "Payment", icon: CreditCard },
                ].map(({ step, title, icon: Icon }, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          activeStep >= step
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : activeStep > step
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {activeStep > step ? (
                          <Check className="w-8 h-8" />
                        ) : (
                          <Icon className="w-8 h-8" />
                        )}
                      </div>
                      <span
                        className={`mt-3 text-sm font-semibold ${
                          activeStep === step
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {title}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className="flex-1 mx-4">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            activeStep > step
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : activeStep === step
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Contact Information */}
            {activeStep === 1 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        errors.fullname
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullname && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.fullname}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        errors.email
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        errors.lastName
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.lastName}
                      </p>
                    )}
                  </div> */}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                      errors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {activeStep === 2 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                {!showAddressForm && (
                  <>
                    {/* Saved Addresses */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Choose from saved addresses
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                              formData.selectedAddressId === address.id
                                ? "border-blue-500 bg-blue-50 shadow-lg"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                selectedAddressId: address.id,
                              })
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {address.type === "home" ? (
                                  <Home className="w-5 h-5 mr-2 text-blue-600" />
                                ) : address.type === "work" ? (
                                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                ) : (
                                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                )}
                                <span className="font-semibold text-gray-800">
                                  {address.name}
                                </span>
                              </div>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.address}
                              {address.apartment && `, ${address.apartment}`}
                              <br />
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="bg-white text-blue-600 border-2 border-blue-200 px-6 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center mx-auto"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Address
                      </button>
                    </div>
                  </>
                )}

                {/* New Address Form */}
                {showAddressForm && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Add New Address
                      </h3>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Address Type *
                        </label>
                        <select
                          name="newAddress.type"
                          value={formData.newAddress.type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Address Name *
                        </label>
                        <input
                          type="text"
                          name="newAddress.name"
                          value={formData.newAddress.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                            errors["newAddress.name"]
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="e.g., Home, Office, etc."
                        />
                        {errors["newAddress.name"] && (
                          <p className="mt-2 text-sm text-red-600 font-medium">
                            {errors["newAddress.name"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rest of the address form fields */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="newAddress.address"
                        value={formData.newAddress.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                          errors["newAddress.address"]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        placeholder="Enter your street address"
                      />
                      {errors["newAddress.address"] && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          {errors["newAddress.address"]}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="newAddress.apartment"
                        value={formData.newAddress.apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300"
                        placeholder="Apartment, suite, floor, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          City *
                        </label>
                        <input
                          type="text"
                          name="newAddress.city"
                          value={formData.newAddress.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                            errors["newAddress.city"]
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="City"
                        />
                        {errors["newAddress.city"] && (
                          <p className="mt-2 text-sm text-red-600 font-medium">
                            {errors["newAddress.city"]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          State *
                        </label>
                        <select
                          name="newAddress.state"
                          value={formData.newAddress.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                            errors["newAddress.state"]
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          <option value="NY">New York</option>
                          <option value="IL">Illinois</option>
                        </select>
                        {errors["newAddress.state"] && (
                          <p className="mt-2 text-sm text-red-600 font-medium">
                            {errors["newAddress.state"]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="newAddress.zipCode"
                          value={formData.newAddress.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                            errors["newAddress.zipCode"]
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="ZIP Code"
                        />
                        {errors["newAddress.zipCode"] && (
                          <p className="mt-2 text-sm text-red-600 font-medium">
                            {errors["newAddress.zipCode"]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleAddNewAddress}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-6 py-3 rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Contact
                  </button>
                  {!showAddressForm && (
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Continue to Payment
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {activeStep === 3 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Payment Information
                  </h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                      errors.cardNumber
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                      errors.cardName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.cardName && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        errors.expiryDate
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ${
                        errors.cvv
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center mb-8">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="saveInfo"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Save payment information for future orders
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-6 py-3 rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shipping
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Place Order • ${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                Order Summary
              </h2>

              <div className="mb-8 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-gray-900 font-bold text-lg">
                      {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">Free</span>
                    ) : (
                      `${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Tax</span>
                  <span className="font-semibold">{tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-gray-900 text-xl">
                    <span>Total</span>
                    <span className="text-blue-600">{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Security Badges */}
              <div className="border-t-2 border-gray-200 pt-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      Secure Payment
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      SSL Encrypted
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-2">
                      <Truck className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      Fast Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Free shipping notice */}
              {subtotal < 100 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium text-center">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
