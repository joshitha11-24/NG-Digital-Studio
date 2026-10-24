import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Camera, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  FileText, 
  Printer, 
  MessageSquare,
  ShieldCheck,
  Clock,
  Layers,
  Heart,
  PhoneCall,
  AlertCircle
} from 'lucide-react';
import { SERVICES_LIST, PACKAGES_DATA, CUSTOMIZABLE_PACKAGE_OPTIONS, STUDIO_INFO } from '../../data/studioData';
import { BookingData, UserAccount, PageType } from '../../types';
import { firestoreBookingsService } from '../../services/firestoreBookings';
import { auth } from '../../firebase/config';

interface BookingFlowProps {
  currentUser: UserAccount | null;
  initialServiceId?: string;
  initialPackageId?: string;
  initialCustomizations?: string[];
  onOpenAuth: () => void;
  onBookingComplete: (booking: BookingData) => void;
  onNavigateHome: () => void;
  onNavigate?: (page: PageType, serviceId?: string) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  currentUser,
  initialServiceId,
  initialPackageId,
  initialCustomizations = [],
  onOpenAuth,
  onBookingComplete,
  onNavigateHome,
  onNavigate
}) => {
  // Step state: 1: Service, 2: Package, 3: Form, 4: Review, 5: Confirmation
  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'wedding-photography');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || 'pkg-luxury');

  // Selected Customizable Options
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>(initialCustomizations);

  // Form Fields
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.phone || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [eventType, setEventType] = useState<string>('Wedding & Reception');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventVenue, setEventVenue] = useState<string>('');
  const [photographyPreference, setPhotographyPreference] = useState<'Traditional & Candid' | 'Candid Exclusive' | 'Cinematic Film' | 'Full Studio Experience'>('Traditional & Candid');
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  
  // Completed Booking Details
  const [completedBooking, setCompletedBooking] = useState<BookingData | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync user if logged in
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!phoneNumber) setPhoneNumber(currentUser.phone);
      if (!email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Sync initialCustomizations if prop updates
  useEffect(() => {
    if (initialCustomizations && initialCustomizations.length > 0) {
      setSelectedCustomizations(initialCustomizations);
    }
  }, [initialCustomizations]);

  // Handle Initial Props
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
    if (initialPackageId) setSelectedPackageId(initialPackageId);
    if (initialServiceId || initialPackageId) {
      setStep(3); // Jump right to form if coming from service or package selection
    }
  }, [initialServiceId, initialPackageId]);

  const currentService = SERVICES_LIST.find((s) => s.id === selectedServiceId) || SERVICES_LIST[0];
  const allPackages = [...PACKAGES_DATA.Wedding, ...PACKAGES_DATA.General];
  const isWeddingService = currentService.categoryTag === 'Weddings' || currentService.id.toLowerCase().includes('wedding') || currentService.id === 'marriage-videography';
  const availablePackagesForService = isWeddingService ? PACKAGES_DATA.Wedding : PACKAGES_DATA.General;
  const currentPackage = allPackages.find((p) => p.id === selectedPackageId) || availablePackagesForService[0];

  const toggleCustomization = (option: string) => {
    setSelectedCustomizations((prev) => 
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setStep(2);
  };

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setStep(3);
  };

  const validateForm = (): string | null => {
    if (!customerName || !customerName.trim()) {
      return 'Please enter your full name.';
    }
    const cleanPhone = phoneNumber ? phoneNumber.trim() : '';
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone || digitsOnly.length < 10) {
      return 'Please enter a valid mobile number with at least 10 digits.';
    }
    const cleanEmail = email ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return 'Please enter a valid email address.';
    }
    if (!eventDate || !eventDate.trim()) {
      return 'Please select your event date.';
    }
    if (!eventVenue || !eventVenue.trim()) {
      return 'Please enter the event venue or city.';
    }
    return null;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      console.warn('Form validation warning:', error);
      return;
    }

    if (!currentUser || !currentUser.isLoggedIn) {
      onOpenAuth();
      return;
    }
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;

    const error = validateForm();
    if (error) {
      console.warn('Booking submission validation warning:', error);
      setStep(3);
      return;
    }

    if (!currentUser || !currentUser.isLoggedIn) {
      console.warn('Customer not authenticated. Opening login modal.');
      onOpenAuth();
      return;
    }

    // Guard: require a live Firebase Auth session so the Firestore create rule
    // (request.resource.data.userId == request.auth.uid) can always be satisfied.
    // currentUser comes from localStorage and may be stale if the session expired.
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      console.warn('Firebase Auth session is not active. Opening login modal.');
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const year = new Date().getFullYear();
    const newBookingId = `NG-${year}-${randomNum}`;

    const newBooking: BookingData = {
      bookingId: newBookingId,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      eventType: eventType.trim(),
      eventDate: eventDate.trim(),
      eventVenue: eventVenue.trim(),
      selectedService: currentService.name,
      selectedPackage: currentPackage.name,
      basePackagePrice: currentPackage.price,
      includedServices: currentPackage.features,
      customizations: selectedCustomizations,
      customizationStatus: selectedCustomizations.length > 0 
        ? 'Contact Studio for Additional Pricing' 
        : 'Standard Base Package',
      photographyPreference,
      specialRequirements,
      additionalNotes,
      totalEstimatedPrice: currentPackage.price,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Pending'
    };

    // Use the live Firebase Auth UID — guaranteed to match request.auth.uid in Firestore rules.
    const rawPrice = Number(String(currentPackage.price).replace(/[^0-9]/g, '')) || 30000;
    const targetUserId = firebaseUser.uid;

    try {
      // 1. Save to Cloud Firestore
      await firestoreBookingsService.createBooking({
        bookingId: newBooking.bookingId,
        userId: targetUserId,
        customerName: customerName.trim(),
        customerEmail: email.trim(),
        customerPhone: phoneNumber.trim(),
        serviceId: selectedServiceId,
        serviceName: currentService.name,
        packageId: selectedPackageId,
        packageName: currentPackage.name,
        basePackagePrice: currentPackage.price,
        includedServices: currentPackage.features,
        customizations: selectedCustomizations,
        customizationStatus: selectedCustomizations.length > 0
          ? 'Contact Studio for Additional Pricing'
          : 'Standard Base Package',
        eventDate: eventDate.trim(),
        bookingDate: new Date().toISOString().split('T')[0],
        eventVenue: eventVenue.trim(),
        eventReason: eventType || 'Grand Celebration',
        expectations: `${photographyPreference}. ${specialRequirements || ''} ${additionalNotes || ''}`.trim(),
        amount: rawPrice,
        advanceAmount: Math.round(rawPrice * 0.3),
        status: 'Pending'
      });

      // 2. Also send to Backend API
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName.trim(),
            customerEmail: email.trim(),
            customerPhone: phoneNumber.trim(),
            serviceId: selectedServiceId,
            serviceName: currentService.name,
            packageId: selectedPackageId,
            packageName: currentPackage.name,
            basePackagePrice: currentPackage.price,
            includedServices: currentPackage.features,
            customizations: selectedCustomizations,
            customizationStatus: selectedCustomizations.length > 0
              ? 'Contact Studio for Additional Pricing'
              : 'Standard Base Package',
            eventDate: eventDate.trim(),
            eventVenue: eventVenue.trim(),
            eventReason: eventType || 'Grand Celebration',
            expectations: `${photographyPreference}. ${specialRequirements || ''} ${additionalNotes || ''}`.trim(),
            amount: rawPrice,
            advanceAmount: Math.round(rawPrice * 0.3)
          })
        });
      } catch (apiErr) {
        console.warn('Backend API booking sync notice:', apiErr);
      }

      // 3. Save to localStorage for instant local access
      const savedBookings = JSON.parse(localStorage.getItem('ng_studio_bookings') || '[]');
      savedBookings.unshift(newBooking);
      localStorage.setItem('ng_studio_bookings', JSON.stringify(savedBookings));

      // 4. Update completed state and proceed to booking receipt page
      setCompletedBooking(newBooking);
      onBookingComplete(newBooking);
      setStep(5);
    } catch (err: any) {
      // Log error properly without floating error popups
      console.error('Firestore booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppMessageUrl = () => {
    if (!completedBooking) return STUDIO_INFO.whatsappDirectUrl;
    const customTxt = completedBooking.customizations && completedBooking.customizations.length > 0
      ? `%0A*Requested Customizations:* ${completedBooking.customizations.join(', ')}%0A*Customization Status:* Contact Studio for Additional Pricing`
      : '';
    const msg = `*NG DIGITAL STUDIO - BOOKING RESERVATION*%0A%0A*Booking ID:* ${completedBooking.bookingId}%0A*Customer:* ${completedBooking.customerName}%0A*Phone:* ${completedBooking.phoneNumber}%0A*Package:* ${completedBooking.selectedPackage}%0A*Base Package Price:* ${completedBooking.basePackagePrice || completedBooking.totalEstimatedPrice}${customTxt}%0A*Event Date:* ${completedBooking.eventDate}%0A*Venue:* ${completedBooking.eventVenue}%0A%0A_Please confirm availability and discuss pricing for requested customizations._`;
    return `https://wa.me/${STUDIO_INFO.whatsapp}?text=${msg}`;
  };

  return (
    <div id="booking-flow-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header Progress Tracker */}
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase">
          RESERVATION & SCHEDULING
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
          Book Studio Coverage
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
          Add Glamour to Your Memories. — Experience personalized artistry for your once-in-a-lifetime celebration.
        </p>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {[
            { num: 1, label: 'Service' },
            { num: 2, label: 'Package' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Review' },
            { num: 5, label: 'Confirmation' },
          ].map((s) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : step > s.num
                      ? 'bg-neutral-800 text-green-400 border border-neutral-700'
                      : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-medium ${
                    step === s.num ? 'text-white' : 'text-neutral-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {s.num < 5 && <div className="w-6 sm:w-10 h-0.5 bg-neutral-800" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* STEP 1: SELECT SERVICE                             */}
      {/* ================================================== */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center sm:text-left">
            <h2 className="font-cinzel text-xl font-bold text-white">
              1. Select Photography or Cinema Service
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Choose the celebration type to explore tailored package tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICES_LIST.map((srv) => (
              <div
                key={srv.id}
                onClick={() => handleServiceSelect(srv.id)}
                className={`group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  selectedServiceId === srv.id
                    ? 'bg-[#151520] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                    : 'bg-[#0f0f14] border-neutral-800 hover:border-[#d4af37]/50'
                }`}
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden mb-3">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-cinzel font-bold text-sm text-white group-hover:text-[#d4af37] transition-colors">
                    {srv.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                    {srv.shortDesc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-[#d4af37] font-semibold">{srv.startingPrice}</span>
                  <span className="text-neutral-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* STEP 2: SELECT PACKAGE                             */}
      {/* ================================================== */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
              </button>
              <h2 className="font-cinzel text-xl font-bold text-white">
                Choose Package for <span className="text-[#d4af37]">{currentService.name}</span>
              </h2>
            </div>
            <span className="text-xs text-neutral-400">All 3 packages include master album & frame</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePackagesForService.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  selectedPackageId === pkg.id
                    ? 'bg-[#151520] border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                    : 'bg-[#0f0f14] border-neutral-800 hover:border-[#d4af37]/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-cinzel font-bold text-lg text-white">{pkg.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{pkg.description}</p>
                  
                  <div className="my-5">
                    <span className="text-3xl font-extrabold text-[#d4af37] font-cinzel">{pkg.price}</span>
                    <span className="text-xs text-neutral-500 ml-1">/ Base Package Price</span>
                  </div>

                  {/* Included Services */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                      Included Services:
                    </span>
                    <ul className="space-y-2 text-xs text-neutral-300">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Customize Your Package */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 bg-[#0a0a0e] p-3 rounded-xl border border-neutral-800">
                    <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d4af37]" /> Customize Your Package
                    </span>
                    <div className="space-y-1.5">
                      {CUSTOMIZABLE_PACKAGE_OPTIONS.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCustomizations.includes(opt)}
                            onChange={() => toggleCustomization(opt)}
                            className="w-3.5 h-3.5 rounded border-neutral-700 text-[#d4af37] accent-[#d4af37]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2 leading-tight">
                      Want to customize your package? Select your preferred services and contact NG Digital Studio personally to discuss availability and additional charges.
                    </p>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => onNavigate('contact')}
                        className="text-[10px] text-[#d4af37] hover:underline mt-1.5 flex items-center gap-1 font-semibold"
                      >
                        <PhoneCall className="w-3 h-3" /> Contact Us for Customization
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  <button
                    type="button"
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedPackageId === pkg.id
                        ? 'btn-gold shadow-md'
                        : 'bg-neutral-800 hover:bg-[#d4af37] text-white hover:text-black'
                    }`}
                  >
                    <span>Select {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* STEP 3: BOOKING FORM                               */}
      {/* ================================================== */}
      {step === 3 && (
        <form onSubmit={handleProceedToReview} className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Package
              </button>
              <h2 className="font-cinzel text-xl font-bold text-white">
                Enter Event & Contact Details
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#d4af37] font-bold">{currentService.name}</span>
              <p className="text-[11px] text-neutral-400">{currentPackage.name} • {currentPackage.price}</p>
            </div>
          </div>

          {/* PACKAGE & CUSTOMIZATION SUMMARY STRIP */}
          <div className="bg-[#101017] border border-[#d4af37]/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_0_25px_rgba(212,175,55,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">
                  Selected Package
                </span>
                <h3 className="text-xl font-cinzel font-extrabold text-white">
                  {currentPackage.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Base Package Price: <span className="text-[#f3e5ab] font-bold">{currentPackage.price}</span>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Estimated Total</span>
                <span className="text-2xl sm:text-3xl font-cinzel font-black text-[#d4af37]">
                  {currentPackage.price}
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  (Base price only • Additional customization charges discussed separately)
                </span>
              </div>
            </div>

            {/* Included Services */}
            <div>
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                Included Package Services:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {currentPackage.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#161622] px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customizable Options (Separate Selection) */}
            <div className="pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  Customize Your Package (Optional Services)
                </span>
                <span className="text-[10px] text-amber-400">
                  {selectedCustomizations.length > 0 ? `${selectedCustomizations.length} selected` : 'None selected'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CUSTOMIZABLE_PACKAGE_OPTIONS.map((opt) => {
                  const isChecked = selectedCustomizations.includes(opt);
                  return (
                    <label
                      key={opt}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#1b1708] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#09090d] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCustomization(opt)}
                          className="w-4 h-4 rounded border-neutral-700 text-[#d4af37] accent-[#d4af37]"
                        />
                        <span className="font-medium">{opt}</span>
                      </div>
                      <span className="text-[10px] text-[#c5a059]">Discuss with Studio</span>
                    </label>
                  );
                })}
              </div>

              {/* Clear notice */}
              <div className="mt-3 p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200/90 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#f3e5ab]">Want to customize your package?</p>
                  <p className="mt-0.5 text-neutral-300">
                    Select your preferred services and contact NG Digital Studio personally to discuss availability and additional charges.
                    Additional charges for customizable options are NOT included in the base package price and will be finalized directly with the studio.
                  </p>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="mt-2 text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Contact Us for Customization
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0e0e13] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Primary Contact Details */}
            <div>
              <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#d4af37]" />
                Customer & Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Customer / Couple Name *
                  </label>
                  <input
                    id="booking-input-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vignesh & Meera"
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    id="booking-input-phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="booking-input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                Event Date & Location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Event Type *
                  </label>
                  <select
                    id="booking-select-event-type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="Wedding & Reception">Wedding & Reception</option>
                    <option value="Puberty Ceremony (Half-Saree)">Puberty Ceremony (Half-Saree)</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Pre-Wedding / Couple Shoot">Pre-Wedding / Couple Shoot</option>
                    <option value="Post-Wedding Shoot">Post-Wedding Shoot</option>
                    <option value="Engagement Photography">Engagement Photography</option>
                    <option value="Outdoor Nature Shoot">Outdoor Nature Shoot</option>
                    <option value="Baby Shower / Seemantham">Baby Shower / Seemantham</option>
                    <option value="Housewarming (Gruhapravesam)">Housewarming (Gruhapravesam)</option>
                    <option value="Newborn Baby Portraits">Newborn Baby Portraits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    id="booking-input-date"
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Event Venue / City *
                  </label>
                  <input
                    id="booking-input-venue"
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. Meenakshi Mahal, Madurai"
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Photography Style & Preferences */}
            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                Shoot Preferences & Auspicious Timings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Photography Style Preference
                  </label>
                  <select
                    id="booking-select-preference"
                    value={photographyPreference}
                    onChange={(e) => setPhotographyPreference(e.target.value as any)}
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="Traditional & Candid">Traditional & Candid (Balanced)</option>
                    <option value="Candid Exclusive">Candid Exclusive (Unposed Emotions)</option>
                    <option value="Cinematic Film">Cinematic 4K Film Focus</option>
                    <option value="Full Studio Experience">Full Studio Luxury Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Special Inquiries or Instructions
                  </label>
                  <input
                    id="booking-input-special"
                    type="text"
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="e.g. Couple entrance choreography, family group shots"
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Additional Notes / Auspicious Timings
                </label>
                <textarea
                  id="booking-input-notes"
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Mention Muhurtham timings, specific rituals, or any special requests..."
                  className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>

            <button
              id="booking-btn-proceed-review"
              type="submit"
              className="px-8 py-3 rounded-xl btn-gold text-sm font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer"
            >
              <span>Review Booking Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ================================================== */}
      {/* STEP 4: REVIEW & CONFIRM                           */}
      {/* ================================================== */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
              </button>
              <h2 className="font-cinzel text-xl font-bold text-white">
                Review & Confirm Your Reservation
              </h2>
            </div>
            <span className="text-xs text-neutral-400">Step 4 of 5</span>
          </div>

          <div className="bg-[#0e0e13] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            
            {/* Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#d4af37] tracking-wider">Reserved Package</span>
                <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white mt-0.5">
                  {currentPackage.name}
                </h3>
                <p className="text-xs text-neutral-400">Service: {currentService.name}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-neutral-400">Base Package Price</span>
                <div className="text-3xl font-cinzel font-extrabold text-[#d4af37]">{currentPackage.price}</div>
                <span className="text-[11px] text-green-400">Fixed Base Total • No Invented Add-on Charges</span>
              </div>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 bg-[#08080b] p-4 rounded-xl border border-neutral-800">
                <h4 className="font-cinzel font-bold text-white text-sm border-b border-neutral-800 pb-2">
                  Client & Event Details
                </h4>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Customer Name:</span>
                  <span className="font-semibold text-white">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Phone Number:</span>
                  <span className="font-semibold text-white">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Email Address:</span>
                  <span className="font-semibold text-white">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Event Date:</span>
                  <span className="font-semibold text-[#f3e5ab]">{eventDate || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Venue Location:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{eventVenue}</span>
                </div>
              </div>

              {/* Included Package Services */}
              <div className="space-y-3 bg-[#08080b] p-4 rounded-xl border border-neutral-800">
                <h4 className="font-cinzel font-bold text-white text-sm border-b border-neutral-800 pb-2">
                  Included Package Services
                </h4>
                <ul className="space-y-1.5 text-neutral-300">
                  {currentPackage.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selected Customizable Options (Displayed Separately!) */}
            <div className="p-4 rounded-xl bg-[#08080b] border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h4 className="font-cinzel font-bold text-[#d4af37] text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Selected Customizable Options
                </h4>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                  Customization Status: Contact Studio for Additional Pricing
                </span>
              </div>

              {selectedCustomizations.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2 pt-1 mb-3">
                    {selectedCustomizations.map((opt) => (
                      <span
                        key={opt}
                        className="px-3 py-1.5 rounded-lg bg-[#191609] border border-[#d4af37]/60 text-white font-medium flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        {opt}
                      </span>
                    ))}
                  </div>

                  {/* CRITICAL STUDIO CUSTOMIZATION NOTICE */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs leading-relaxed">
                    <p className="font-bold text-[#f3e5ab] flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                      Important Studio Pricing Policy:
                    </p>
                    <p>
                      You have selected customizable options ({selectedCustomizations.join(', ')}). 
                      You must contact NG Digital Studio personally to finalize shoot availability and agreed additional pricing. 
                      <strong> This booking will not be treated as fully price-finalized until the studio and client have discussed and agreed on the additional charges.</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-400 italic">
                  No customizable add-ons selected. Standard base package deliverables apply.
                </p>
              )}
            </div>

            {/* Special Instructions */}
            {(specialRequirements || additionalNotes) && (
              <div className="p-4 rounded-xl bg-[#08080b] border border-neutral-800 text-xs">
                <span className="text-neutral-400 font-semibold block mb-1">Special Notes & Auspicious Timings:</span>
                <p className="text-neutral-300 italic">{specialRequirements} {additionalNotes && `• ${additionalNotes}`}</p>
              </div>
            )}

            {/* Booking Policies */}
            <div className="text-[11px] text-neutral-400 bg-neutral-900/50 p-3 rounded-lg flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span>
                By confirming this booking request, our studio management will lock your date on the studio schedule and reach out to conduct your personalized consultation.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Back
            </button>

            <button
              id="booking-btn-final-confirm"
              data-testid="booking-submit-btn"
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-10 py-3.5 rounded-xl btn-gold text-sm font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Booking...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Booking</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* STEP 5: FINAL BOOKING CONFIRMATION & SUMMARY       */}
      {/* ================================================== */}
      {step === 5 && completedBooking && (
        <div className="space-y-6 animate-in zoom-in-95 duration-400 text-center max-w-2xl mx-auto">
          
          {/* Animated Success Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f3e5ab] text-black shadow-[0_0_40px_rgba(212,175,55,0.5)] mb-2 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#d4af37] tracking-[0.2em] uppercase">
              CONFIRMATION SUCCESSFUL
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mt-1 uppercase">
              Booking Request Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2">
              Thank you, <span className="text-[#f3e5ab] font-bold">{completedBooking.customerName}</span>! Your photography reservation has been recorded in the NG Digital Studio schedule.
            </p>
          </div>

          {/* Booking Card & Receipt Summary */}
          <div className="bg-[#101017] border-2 border-[#d4af37]/60 rounded-2xl p-6 sm:p-8 text-left space-y-4 shadow-[0_0_40px_rgba(212,175,55,0.2)] relative overflow-hidden">
            
            {/* Watermark Logo */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none font-cinzel font-extrabold text-8xl text-[#d4af37]">
              NG
            </div>

            {/* Reference Number & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-2">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono">Official Booking Reference Number</span>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#d4af37] tracking-wider">
                  {completedBooking.bookingId}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Final Booking Status</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                  ● {completedBooking.status} (Reserved)
                </span>
              </div>
            </div>

            {/* Core Summary Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-neutral-400 block">Customer Name:</span>
                <span className="font-bold text-white text-sm">{completedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Selected Package:</span>
                <span className="font-bold text-[#f3e5ab] text-sm">{completedBooking.selectedPackage}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Base Package Price:</span>
                <span className="font-bold text-[#d4af37] text-base font-cinzel">
                  {completedBooking.basePackagePrice || completedBooking.totalEstimatedPrice}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Event Date & Venue:</span>
                <span className="font-semibold text-white">{completedBooking.eventDate} • {completedBooking.eventVenue}</span>
              </div>
            </div>

            {/* Included Package Services */}
            <div className="pt-3 border-t border-neutral-800">
              <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                Included Package Services:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-200">
                {(completedBooking.includedServices || currentPackage.features).map((srv, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Customizable Options */}
            <div className="pt-3 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">
                  Selected Customizable Options:
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {completedBooking.customizationStatus || 'Contact Studio for Additional Pricing'}
                </span>
              </div>

              {completedBooking.customizations && completedBooking.customizations.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {completedBooking.customizations.map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded bg-[#1f1a0b] text-[#f3e5ab] border border-[#d4af37]/40 text-xs font-medium">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                  
                  {/* Notice for customizable options */}
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/50 text-[11px] text-amber-200 leading-relaxed">
                    <strong className="text-white block mb-0.5">Customization Action Required:</strong>
                    You have requested customizable services ({completedBooking.customizations.join(', ')}).
                    Please contact NG Digital Studio personally to discuss date availability and agree on additional charges.
                    <strong> This booking is not treated as fully price-finalized until the studio has discussed and agreed on the additional charges.</strong>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-neutral-400 italic">None selected (Standard Base Package)</span>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>{STUDIO_INFO.address} • {STUDIO_INFO.phone}</span>
              <span>Generated on {completedBooking.createdAt}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            
            {/* WhatsApp Direct Notify */}
            <a
              id="booking-whatsapp-btn"
              href={getWhatsAppMessageUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Send to Studio on WhatsApp</span>
            </a>

            {/* Print Receipt */}
            <button
              id="booking-print-btn"
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#d4af37]" />
              <span>Print Booking Slip</span>
            </button>

            {/* Return to Home */}
            <button
              id="booking-home-btn"
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3 rounded-xl btn-gold text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
