// Wellbeing Credits & Gamification System
// Manages earning, validation, decay, and redemption of wellness credits

class CreditsSystem {
    constructor() {
        this.earningRules = {
            exercise: { points: 15, validation: 'consistency' },
            goodSleep: { points: 10, validation: 'range' }, // 7-9 hours
            lowScreenTime: { points: 8, validation: 'threshold' }, // <4 hours
            taskCompletion: { points: 5, validation: 'immediate' },
            wellnessCheckIn: { points: 20, validation: 'daily' },
            weeklyStreak: { points: 50, validation: 'streak' },
            improvedWellbeing: { points: 25, validation: 'trend' }
        };

        this.decayRate = 0.05; // 5% per week
        this.maxDailyEarning = 100; // Prevent farming
    }

    // ==================== CREDIT EARNING ====================
    calculateCreditsEarned(activity, data, history) {
        const rule = this.earningRules[activity];
        if (!rule) return { earned: 0, reason: 'Unknown activity' };

        // Check validation
        const validation = this.validateActivity(activity, data, history);
        if (!validation.valid) {
            return { earned: 0, reason: validation.reason };
        }

        // Check daily limit
        const todayEarned = this.getTodayEarnings(history);
        if (todayEarned >= this.maxDailyEarning) {
            return { earned: 0, reason: 'Daily earning limit reached' };
        }

        const earned = Math.min(rule.points, this.maxDailyEarning - todayEarned);

        return {
            earned,
            reason: validation.reason,
            newTotal: (data.creditsBalance || 0) + earned
        };
    }

    // ==================== VALIDATION ====================
    validateActivity(activity, data, history) {
        const rule = this.earningRules[activity];

        switch (rule.validation) {
            case 'consistency':
                return this.validateConsistency(data, history);

            case 'range':
                return this.validateSleepRange(data);

            case 'threshold':
                return this.validateScreenTime(data);

            case 'immediate':
                return { valid: true, reason: 'Task completed' };

            case 'daily':
                return this.validateDailyCheckIn(data, history);

            case 'streak':
                return this.validateStreak(history);

            case 'trend':
                return this.validateTrend(data, history);

            default:
                return { valid: false, reason: 'Unknown validation type' };
        }
    }

    validateConsistency(data, history) {
        // For exercise: must have logged exercise at least 3 times in last 7 days
        if (!history || history.length < 3) {
            return { valid: false, reason: 'Not enough history for consistency check' };
        }

        const last7Days = history.slice(-7);
        const exerciseDays = last7Days.filter(d => d.exerciseLogged).length;

        if (exerciseDays >= 3) {
            return { valid: true, reason: 'Consistent exercise pattern verified' };
        }

        return { valid: false, reason: 'Need more consistent exercise' };
    }

    validateSleepRange(data) {
        const sleepHours = parseFloat(data.sleepHours);
        if (sleepHours >= 7 && sleepHours <= 9) {
            return { valid: true, reason: 'Healthy sleep duration achieved' };
        }
        return { valid: false, reason: 'Sleep outside healthy range (7-9 hours)' };
    }

    validateScreenTime(data) {
        const screenTime = parseFloat(data.screenTime);
        if (screenTime < 4) {
            return { valid: true, reason: 'Screen time below recommended limit' };
        }
        return { valid: false, reason: 'Screen time too high' };
    }

    validateDailyCheckIn(data, history) {
        // Can only earn once per day
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = history && history.find(h => h.date === today && h.type === 'checkIn');

        if (todayEntry) {
            return { valid: false, reason: 'Already checked in today' };
        }

        return { valid: true, reason: 'Daily check-in completed' };
    }

    validateStreak(history) {
        const streak = this.calculateStreak(history);
        if (streak >= 7) {
            return { valid: true, reason: `${streak}-day streak achieved!` };
        }
        return { valid: false, reason: `Current streak: ${streak} days (need 7)` };
    }

    validateTrend(data, history) {
        if (!history || history.length < 7) {
            return { valid: false, reason: 'Not enough history for trend analysis' };
        }

        // Check if wellbeing improved by 10+ points
        const recent = history[history.length - 1]?.wellbeingIndex || 0;
        const previous = history[history.length - 7]?.wellbeingIndex || 0;

        if (recent - previous >= 10) {
            return { valid: true, reason: 'Wellbeing significantly improved!' };
        }

        return { valid: false, reason: 'No significant wellbeing improvement yet' };
    }

    // ==================== STREAK CALCULATION ====================
    calculateStreak(history) {
        if (!history || history.length === 0) return 0;

        let streak = 0;
        const today = new Date();

        // Sort history by date descending
        const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

        for (let i = 0; i < sorted.length; i++) {
            const entryDate = new Date(sorted[i].date);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            // Check if entry is from expected consecutive day
            if (entryDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
                streak++;
            } else if (i === 0 && entryDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
                // Allow same-day entry
                streak++;
            } else {
                break; // Streak broken
            }
        }

        return streak;
    }

    // ==================== DAILY EARNINGS ====================
    getTodayEarnings(history) {
        if (!history || history.length === 0) return 0;

        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = history.filter(h =>
            h.date === today && h.type === 'earn'
        );

        return todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    // ==================== CREDIT DECAY ====================
    applyDecay(credits, lastUpdate) {
        const now = new Date();
        const lastDate = new Date(lastUpdate);
        const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff < 7) return credits;

        const weeksPassed = Math.floor(daysDiff / 7);
        const decayedCredits = credits * Math.pow(1 - this.decayRate, weeksPassed);

        return Math.max(0, Math.floor(decayedCredits));
    }

    // ==================== REDEMPTION ====================
    canRedeem(credits, itemCost) {
        return credits >= itemCost;
    }

    redeem(credits, itemCost, itemName) {
        if (!this.canRedeem(credits, itemCost)) {
            return {
                success: false,
                reason: 'Insufficient credits',
                remaining: credits
            };
        }

        const newBalance = credits - itemCost;

        return {
            success: true,
            item: itemName,
            cost: itemCost,
            remaining: newBalance,
            transaction: {
                type: 'redeem',
                amount: -itemCost,
                item: itemName,
                date: new Date().toISOString()
            }
        };
    }

    // ==================== REWARDS CATALOG ====================
    getRewardsCatalog() {
        return {
            stationery: [
                { id: 'notebook', name: 'Premium Notebook', points: 50, image: '📓' },
                { id: 'pens', name: 'Pen Set', points: 30, image: '🖊️' },
                { id: 'planner', name: 'Study Planner', points: 75, image: '📅' },
                { id: 'highlighters', name: 'Highlighter Set', points: 40, image: '🖍️' }
            ],
            wellness: [
                { id: 'yoga_pass', name: 'Yoga Class Pass', points: 100, image: '🧘' },
                { id: 'break_credit', name: 'Extended Break Credit', points: 60, image: '⏰' },
                { id: 'sports_voucher', name: 'Sports Equipment Voucher', points: 120, image: '⚽' },
                { id: 'meditation_app', name: 'Meditation App Subscription', points: 150, image: '🧘' }
            ],
            campus: [
                { id: 'library_pass', name: 'Priority Library Access', points: 80, image: '📚' },
                { id: 'cafeteria_voucher', name: 'Cafeteria Voucher', points: 90, image: '🍽️' },
                { id: 'event_priority', name: 'Event Priority Booking', points: 70, image: '🎫' },
                { id: 'locker_upgrade', name: 'Locker Upgrade', points: 100, image: '🔐' }
            ]
        };
    }

    // ==================== LEADERBOARD ====================
    calculateLeaderboardPosition(userCredits, allUsers) {
        // Sort users by credits descending
        const sorted = allUsers.sort((a, b) => b.credits - a.credits);

        const position = sorted.findIndex(u => u.credits === userCredits) + 1;
        const total = allUsers.length;

        let badge = null;
        if (position === 1) badge = '🥇';
        else if (position === 2) badge = '🥈';
        else if (position === 3) badge = '🥉';

        return {
            position,
            total,
            badge,
            percentile: Math.round((1 - (position / total)) * 100)
        };
    }

    // ==================== ACHIEVEMENT TRACKING ====================
    checkAchievements(totalEarned) {
        const achievements = [
            { id: 'first_100', name: 'First 100 Credits', threshold: 100, badge: '🌟' },
            { id: 'wellness_warrior', name: 'Wellness Warrior', threshold: 500, badge: '⚡' },
            { id: 'habit_champion', name: 'Habit Champion', threshold: 1000, badge: '🏆' },
            { id: 'wellbeing_master', name: 'Wellbeing Master', threshold: 2000, badge: '👑' }
        ];

        return achievements.filter(a => totalEarned >= a.threshold);
    }
}

// Create global instance
const creditsSystem = new CreditsSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CreditsSystem, creditsSystem };
}
