import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  User,
  ADMIN_EMAILS
} from '../firebase/config';

export interface FirebaseUserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

export const firebaseAuthService = {
  /**
   * Register a new customer with Email and Password
   * Automatically triggers email verification and creates Firestore profile
   */
  async registerCustomer(
    name: string,
    phone: string,
    email: string,
    pass: string
  ): Promise<{ user: User; profile: FirebaseUserProfile; verificationSent: boolean }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Prevent registering with designated admin email addresses via customer registration
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      throw new Error("This email address is reserved for studio administration. Customers must register using their personal email.");
    }

    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    const user = userCredential.user;

    // 2. Set display name
    await updateProfile(user, { displayName: cleanName });

    // 3. Send email verification
    let verificationSent = false;
    try {
      await sendEmailVerification(user);
      verificationSent = true;
    } catch (e) {
      console.warn("Could not send verification email immediately:", e);
    }

    // 4. Save profile to Firestore `users/{uid}` strictly as customer
    const role: 'customer' = 'customer';
    const profile: FirebaseUserProfile = {
      uid: user.uid,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
    } catch (err) {
      console.warn("Firestore users collection write note:", err);
    }

    return { user, profile, verificationSent };
  },

  /**
   * Log in customer or admin with Email and Password
   */
  async login(email: string, pass: string): Promise<{ user: User; profile: FirebaseUserProfile | null }> {
    const cleanEmail = email.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    const user = userCredential.user;

    // Reload user to get latest emailVerified state
    await user.reload();

    let profile: FirebaseUserProfile | null = null;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        profile = userDoc.data() as FirebaseUserProfile;
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: serverTimestamp(),
          emailVerified: user.emailVerified
        }, { merge: true });
      } else {
        // Create initial profile if missing
        profile = {
          uid: user.uid,
          name: user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: '',
          role: ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'customer',
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', user.uid), profile);
      }
    } catch (err) {
      console.warn("Could not retrieve Firestore profile:", err);
    }

    return { user, profile };
  },

  /**
   * Resend Email Verification link to currently signed in user
   */
  async resendVerificationEmail(user?: User | null): Promise<boolean> {
    const targetUser = user || auth.currentUser;
    if (!targetUser) throw new Error("No user is currently signed in");
    await sendEmailVerification(targetUser);
    return true;
  },

  /**
   * Send Password Reset Email
   */
  async sendPasswordReset(email: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, cleanEmail);
    return true;
  },

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    await signOut(auth);
    localStorage.removeItem('ng_studio_user');
  },

  /**
   * Listen to Auth State changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Get current auth user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
