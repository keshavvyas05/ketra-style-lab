// ─── MOCK DATA FOR ADMIN DASHBOARD ──────────────────────────

export const adminStats = {
  totalUsers: 12_847,
  usersGrowth: 12.5,
  totalVendors: { active: 84, pending: 23, inactive: 11 },
  totalTryOnsToday: 1_243,
  totalTryOnsMonth: 94_312,
  totalTryOnsEver: 847_291,
  avgTryOnsPerUser: 7.4,
  platformTryOnsRemaining: 128_450,
  activePromoCodes: 8,
  revenueThisMonth: 48_920,
  revenueLastMonth: 42_100,
  revenueAllTime: 384_500,
  revenueGrowth: 15.2,
  estimatedAPICost: 12_400,
  estimatedProfit: 36_520,
};

export const recentSignups = [
  { id: 1, name: "Sara Ahmed", email: "sara@gmail.com", plan: "Pro", date: "2 hours ago", photo: null },
  { id: 2, name: "Omar Khan", email: "omar.k@email.com", plan: "Free", date: "4 hours ago", photo: null },
  { id: 3, name: "Lina Malik", email: "lina.m@email.com", plan: "Premium", date: "6 hours ago", photo: null },
  { id: 4, name: "Yusuf Ali", email: "yusuf@email.com", plan: "Free", date: "8 hours ago", photo: null },
  { id: 5, name: "Noor Hassan", email: "noor.h@email.com", plan: "Pro", date: "12 hours ago", photo: null },
];

export const recentVendorRegs = [
  { id: 1, name: "Bloom Fashion", country: "UAE", flag: "🇦🇪", status: "pending" as const, date: "1 hour ago" },
  { id: 2, name: "Silk & Stone", country: "India", flag: "🇮🇳", status: "pending" as const, date: "3 hours ago" },
  { id: 3, name: "Noir Atelier", country: "Saudi Arabia", flag: "🇸🇦", status: "active" as const, date: "1 day ago" },
  { id: 4, name: "Casa Mode", country: "Morocco", flag: "🇲🇦", status: "active" as const, date: "2 days ago" },
  { id: 5, name: "Velvet Thread", country: "Pakistan", flag: "🇵🇰", status: "active" as const, date: "3 days ago" },
];

export const recentPayments = [
  { id: 1, user: "Sara Ahmed", amount: 1499, plan: "Pro", status: "success" as const, date: "2 hours ago" },
  { id: 2, user: "Lina Malik", amount: 2999, plan: "Premium", status: "success" as const, date: "6 hours ago" },
  { id: 3, user: "Ahmed R.", amount: 1499, plan: "Pro", status: "failed" as const, date: "8 hours ago" },
  { id: 4, user: "Fatima S.", amount: 2999, plan: "Premium", status: "success" as const, date: "1 day ago" },
  { id: 5, user: "Zain W.", amount: 1499, plan: "Pro", status: "success" as const, date: "1 day ago" },
];

export const urgentAlerts = [
  { id: 1, message: "Vendor 'Zara Studio' pool exhausted — 0 try-ons remaining", type: "critical" },
  { id: 2, message: "Fashn.ai API balance low — ₹2,340 remaining (~180 try-ons)", type: "warning" },
  { id: 3, message: "3 vendor applications pending approval for 48+ hours", type: "warning" },
];

export const userGrowthData = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  users: 12000 + Math.floor(Math.random() * 900) + i * 28,
}));

export const dailyTryOnsData = [
  { day: "Mon", tryOns: 1450 },
  { day: "Tue", tryOns: 1680 },
  { day: "Wed", tryOns: 1320 },
  { day: "Thu", tryOns: 1890 },
  { day: "Fri", tryOns: 2100 },
  { day: "Sat", tryOns: 1750 },
  { day: "Sun", tryOns: 1243 },
];

export const allUsers = [
  { id: 1, name: "Sara Ahmed", email: "sara@gmail.com", plan: "Pro", tryOnsRemaining: 24, tryOnsUsed: 6, instagram: "@sara.style", memberSince: "2025-11-15", status: "active" as const },
  { id: 2, name: "Omar Khan", email: "omar.k@email.com", plan: "Free", tryOnsRemaining: 1, tryOnsUsed: 2, instagram: "@omar.fits", memberSince: "2026-01-20", status: "active" as const },
  { id: 3, name: "Lina Malik", email: "lina.m@email.com", plan: "Premium", tryOnsRemaining: 999, tryOnsUsed: 47, instagram: "@lina.mode", memberSince: "2025-10-05", status: "active" as const },
  { id: 4, name: "Yusuf Ali", email: "yusuf@email.com", plan: "Free", tryOnsRemaining: 0, tryOnsUsed: 3, instagram: "@yusuf.drip", memberSince: "2026-02-28", status: "inactive" as const },
  { id: 5, name: "Noor Hassan", email: "noor.h@email.com", plan: "Pro", tryOnsRemaining: 18, tryOnsUsed: 12, instagram: "@noor.chic", memberSince: "2025-12-10", status: "active" as const },
  { id: 6, name: "Amira K.", email: "amira@email.com", plan: "Premium", tryOnsRemaining: 999, tryOnsUsed: 89, instagram: "@amira.style", memberSince: "2025-08-01", status: "active" as const },
  { id: 7, name: "Hassan R.", email: "hassan@email.com", plan: "Free", tryOnsRemaining: 3, tryOnsUsed: 0, instagram: "@hassan.r", memberSince: "2026-03-01", status: "active" as const },
  { id: 8, name: "Fatima S.", email: "fatima@email.com", plan: "Pro", tryOnsRemaining: 15, tryOnsUsed: 15, instagram: "@fatima.s", memberSince: "2025-09-14", status: "active" as const },
];

export const allVendors = [
  { id: 1, name: "Zara Studio", country: "UAE", flag: "🇦🇪", subdomain: "zara.ketra.in", poolSize: 500, poolUsed: 500, poolRemaining: 0, perCustomerLimit: 3, planPrice: 9999, currency: "INR", status: "active" as const, registered: "2025-12-01", revenue: 42000 },
  { id: 2, name: "Noir Atelier", country: "Saudi Arabia", flag: "🇸🇦", subdomain: "noir.ketra.in", poolSize: 300, poolUsed: 187, poolRemaining: 113, perCustomerLimit: 2, planPrice: 4999, currency: "INR", status: "active" as const, registered: "2026-01-15", revenue: 31000 },
  { id: 3, name: "Bloom Fashion", country: "India", flag: "🇮🇳", subdomain: "bloom.ketra.in", poolSize: 200, poolUsed: 0, poolRemaining: 200, perCustomerLimit: 3, planPrice: 4999, currency: "INR", status: "pending" as const, registered: "2026-03-01", revenue: 0 },
  { id: 4, name: "Velvet Thread", country: "Pakistan", flag: "🇵🇰", subdomain: "velvet.ketra.in", poolSize: 100, poolUsed: 82, poolRemaining: 18, perCustomerLimit: 2, planPrice: 2999, currency: "INR", status: "active" as const, registered: "2025-09-20", revenue: 18000 },
  { id: 5, name: "Silk & Stone", country: "India", flag: "🇮🇳", subdomain: "silk.ketra.in", poolSize: 300, poolUsed: 0, poolRemaining: 300, perCustomerLimit: 3, planPrice: 4999, currency: "INR", status: "pending" as const, registered: "2026-03-05", revenue: 0 },
  { id: 6, name: "Casa Mode", country: "Morocco", flag: "🇲🇦", subdomain: "casa.ketra.in", poolSize: 400, poolUsed: 245, poolRemaining: 155, perCustomerLimit: 3, planPrice: 7999, currency: "INR", status: "active" as const, registered: "2025-11-10", revenue: 28000 },
];

export const tryOnSessions = [
  { id: 1, user: "Sara Ahmed", source: "Ketra Direct", timestamp: "10:42 AM", status: "success" as const },
  { id: 2, user: "Guest #4821", source: "Zara Studio", timestamp: "10:38 AM", status: "success" as const },
  { id: 3, user: "Omar Khan", source: "Ketra Direct", timestamp: "10:35 AM", status: "failed" as const },
  { id: 4, user: "Guest #1204", source: "Noir Atelier", timestamp: "10:31 AM", status: "success" as const },
  { id: 5, user: "Lina Malik", source: "Ketra Direct", timestamp: "10:28 AM", status: "success" as const },
  { id: 6, user: "Guest #7892", source: "Casa Mode", timestamp: "10:22 AM", status: "success" as const },
  { id: 7, user: "Noor Hassan", source: "Ketra Direct", timestamp: "10:18 AM", status: "success" as const },
  { id: 8, user: "Guest #3345", source: "Velvet Thread", timestamp: "10:15 AM", status: "failed" as const },
];

export const tryOnSourceSplit = [
  { name: "Ketra Direct", value: 68, fill: "hsl(340, 60%, 55%)" },
  { name: "Vendor Subdomain", value: 32, fill: "hsl(200, 70%, 55%)" },
];

export const activeVendorsToday = [
  { name: "Zara Studio", tryOns: 89 },
  { name: "Noir Atelier", tryOns: 67 },
  { name: "Casa Mode", tryOns: 45 },
  { name: "Velvet Thread", tryOns: 23 },
];

export const revenueByPlan = [
  { plan: "Free", users: 9841, revenue: 0 },
  { plan: "Pro", users: 2180, revenue: 32658 },
  { plan: "Premium", users: 826, revenue: 24754 },
];

export const revenueByVendor = [
  { name: "Zara Studio", monthly: 9999 },
  { name: "Casa Mode", monthly: 7999 },
  { name: "Noir Atelier", monthly: 4999 },
  { name: "Velvet Thread", monthly: 2999 },
];

export const revenueOverMonths = [
  { month: "Oct", revenue: 28400 },
  { month: "Nov", revenue: 32100 },
  { month: "Dec", revenue: 38700 },
  { month: "Jan", revenue: 41200 },
  { month: "Feb", revenue: 42100 },
  { month: "Mar", revenue: 48920 },
];

export const newPayingUsersPerMonth = [
  { month: "Oct", users: 180 },
  { month: "Nov", users: 220 },
  { month: "Dec", users: 310 },
  { month: "Jan", users: 275 },
  { month: "Feb", users: 340 },
  { month: "Mar", users: 390 },
];

export const ootwSubmissions = [
  { id: 1, user: "Amira K.", instagram: "@amira.style", type: "Virtual Try-on", aiStyle: 8.5, aiTrend: 9.0, aiCreativity: 8.8, aiImpression: 9.2, totalAI: 35.5, communityVotes: 892, finalScore: 44.42, date: "Mar 3" },
  { id: 2, user: "Lina M.", instagram: "@lina.mode", type: "Real Photo", aiStyle: 8.2, aiTrend: 8.5, aiCreativity: 9.1, aiImpression: 8.8, totalAI: 34.6, communityVotes: 756, finalScore: 42.16, date: "Mar 4" },
  { id: 3, user: "Sara A.", instagram: "@sara.style", type: "Virtual Try-on", aiStyle: 7.9, aiTrend: 8.8, aiCreativity: 8.4, aiImpression: 8.6, totalAI: 33.7, communityVotes: 641, finalScore: 40.11, date: "Mar 2" },
  { id: 4, user: "Noor H.", instagram: "@noor.chic", type: "Real Photo", aiStyle: 8.0, aiTrend: 8.2, aiCreativity: 8.0, aiImpression: 8.5, totalAI: 32.7, communityVotes: 534, finalScore: 38.04, date: "Mar 5" },
];

export const pastWinners = [
  { week: "Week 9", name: "Zain R.", instagram: "@zain.drip", score: 46.2, date: "Mar 3, 2026" },
  { week: "Week 8", name: "Amira K.", instagram: "@amira.style", score: 44.8, date: "Feb 24, 2026" },
  { week: "Week 7", name: "Layla M.", instagram: "@laylamode", score: 43.1, date: "Feb 17, 2026" },
  { week: "Week 6", name: "Omar S.", instagram: "@omar.fits", score: 41.9, date: "Feb 10, 2026" },
];

export const allPromoCodes = [
  { id: 1, code: "LAUNCH25", type: "Discount", value: "25%", maxUses: 500, used: 342, expiry: "2026-04-30", active: true, created: "2026-01-01" },
  { id: 2, code: "TRYKETRA", type: "Free Try-ons", value: "5 try-ons", maxUses: 200, used: 128, expiry: "2026-03-31", active: true, created: "2026-02-01" },
  { id: 3, code: "VIP50", type: "Discount", value: "50%", maxUses: 50, used: 50, expiry: "2026-02-28", active: false, created: "2026-01-15" },
  { id: 4, code: "WELCOME10", type: "Free Try-ons", value: "10 try-ons", maxUses: 1000, used: 234, expiry: "2026-06-30", active: true, created: "2026-03-01" },
  { id: 5, code: "RAMADAN", type: "Discount", value: "30%", maxUses: 300, used: 89, expiry: "2026-04-15", active: true, created: "2026-03-05" },
];

export const notificationsLog = [
  { id: 1, recipient: "Sara Ahmed", recipientType: "user", type: "welcome", channel: "email", status: "sent" as const, timestamp: "Mar 8, 10:42 AM" },
  { id: 2, recipient: "Bloom Fashion", recipientType: "vendor", type: "approval", channel: "email", status: "sent" as const, timestamp: "Mar 8, 9:15 AM" },
  { id: 3, recipient: "Amira K.", recipientType: "user", type: "winner", channel: "whatsapp", status: "sent" as const, timestamp: "Mar 7, 8:00 PM" },
  { id: 4, recipient: "Omar Khan", recipientType: "user", type: "warning", channel: "email", status: "failed" as const, timestamp: "Mar 7, 6:30 PM" },
  { id: 5, recipient: "Admin Team", recipientType: "admin", type: "alert", channel: "whatsapp", status: "sent" as const, timestamp: "Mar 7, 5:00 PM" },
  { id: 6, recipient: "Zara Studio", recipientType: "vendor", type: "pool-warning", channel: "email", status: "sent" as const, timestamp: "Mar 7, 3:00 PM" },
  { id: 7, recipient: "Lina Malik", recipientType: "user", type: "payment", channel: "email", status: "sent" as const, timestamp: "Mar 7, 1:00 PM" },
];

export const individualPlans = [
  { id: "free", name: "Free", price: 0, tryOns: 2 },
  { id: "bronze", name: "Bronze", price: 199, tryOns: 12 },
  { id: "silver", name: "Silver", price: 499, tryOns: 30 },
  { id: "gold", name: "Gold", price: 1499, tryOns: -1 },
];

export const vendorPlans = [
  { id: "starter", name: "Starter", price: 2999, pool: 100 },
  { id: "growth", name: "Growth", price: 4999, pool: 300 },
  { id: "professional", name: "Professional", price: 7999, pool: 500 },
  { id: "enterprise", name: "Enterprise", price: 14999, pool: 1500 },
];

export const platformSettings = {
  fashnAI: { balance: 2340, lastChecked: "Mar 8, 10:30 AM", status: "warning" as const },
  supabase: { status: "connected" as const, lastChecked: "Mar 8, 10:00 AM" },
  razorpay: { status: "connected" as const, lastChecked: "Mar 8, 9:00 AM" },
  stripe: { status: "connected" as const, lastChecked: "Mar 8, 9:00 AM" },
  resend: { status: "connected" as const, lastChecked: "Mar 8, 8:00 AM" },
  n8n: { status: "connected" as const, lastChecked: "Mar 8, 7:00 AM" },
  wati: { status: "connected" as const, lastChecked: "Mar 8, 7:00 AM" },
  globalPerCustomerLimit: 3,
};
