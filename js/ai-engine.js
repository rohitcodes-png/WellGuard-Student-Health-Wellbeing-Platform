// AI Risk Engine & Persona Detection System
// Calculates wellbeing scores and detects student personas

class AIRiskEngine {
    constructor() {
        this.riskCategories = {
            mentalHealth: { weight: 0.35, name: 'Mental Health' },
            lifestyle: { weight: 0.25, name: 'Lifestyle' },
            digitalWellbeing: { weight: 0.20, name: 'Digital Wellbeing' },
            physicalHealth: { weight: 0.20, name: 'Physical Health' }
        };
    }

    // ==================== MAIN RISK CALCULATION ====================
    calculateAllRisks(studentData) {
        const risks = {
            mentalHealth: this.calculateMentalHealthRisk(studentData),
            lifestyle: this.calculateLifestyleRisk(studentData),
            digitalWellbeing: this.calculateDigitalWellbeingRisk(studentData),
            physicalHealth: this.calculatePhysicalHealthRisk(studentData),
            timestamp: new Date().toISOString()
        };

        // Calculate overall wellbeing index
        risks.wellbeingIndex = this.calculateWellbeingIndex(risks);

        // Detect trend
        risks.trend = this.detectTrend(studentData);

        // Detect persona
        risks.persona = this.detectPersona(studentData, risks);

        // Generate explanations
        risks.explanations = this.generateExplanations(studentData, risks);

        return risks;
    }

    // ==================== MENTAL HEALTH RISK ====================
    calculateMentalHealthRisk(data) {
        let score = 100; // Start with perfect score

        // Stress level impact (1-5 scale)
        const stressLevel = data.stressLevel || 3;
        score -= (stressLevel - 1) * 15; // Max -60 for stress level 5

        // Academic pressure impact (1-5 scale)
        const academicPressure = data.academicPressure || 3;
        score -= (academicPressure - 1) * 10; // Max -40 for pressure 5

        // Mood impact
        const moodScores = {
            'amazing': 0,
            'happy': 5,
            'okay': 15,
            'sad': 30,
            'stressed': 40
        };
        score -= moodScores[data.mood] || 15;

        // Historical trend
        if (data.history && data.history.length > 3) {
            const recentStress = data.history.slice(-7).map(d => d.stressLevel || 3);
            const avgStress = recentStress.reduce((a, b) => a + b, 0) / recentStress.length;
            if (avgStress >= 4) score -= 10; // Sustained high stress penalty
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            color: this.getColorForScore(score),
            level: this.getLevelForScore(score),
            factors: this.getMentalHealthFactors(data)
        };
    }

    getMentalHealthFactors(data) {
        const factors = [];
        if ((data.stressLevel || 3) >= 4) factors.push('High stress level');
        if ((data.academicPressure || 3) >= 4) factors.push('High academic pressure');
        if (data.mood === 'stressed' || data.mood === 'sad') factors.push('Negative mood');
        return factors;
    }

    // ==================== LIFESTYLE RISK ====================
    calculateLifestyleRisk(data) {
        let score = 100;

        // Sleep hours (optimal: 7-9 hours)
        const sleepHours = parseFloat(data.sleepHours) || 7;
        if (sleepHours < 6) {
            score -= 30; // Severe sleep deprivation
        } else if (sleepHours < 7) {
            score -= 15; // Mild sleep deprivation
        } else if (sleepHours > 9) {
            score -= 10; // Excessive sleep
        }

        // Sleep consistency
        if (data.history && data.history.length >= 7) {
            const sleepData = data.history.slice(-7).map(d => parseFloat(d.sleepHours) || 7);
            const avgSleep = sleepData.reduce((a, b) => a + b, 0) / sleepData.length;
            const variance = sleepData.reduce((sum, val) => sum + Math.pow(val - avgSleep, 2), 0) / sleepData.length;

            if (variance > 2) score -= 10; // Inconsistent sleep pattern
            if (avgSleep < 6.5) score -= 15; // Chronic sleep debt
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            color: this.getColorForScore(score),
            level: this.getLevelForScore(score),
            factors: this.getLifestyleFactors(data)
        };
    }

    getLifestyleFactors(data) {
        const factors = [];
        const sleepHours = parseFloat(data.sleepHours) || 7;
        if (sleepHours < 6) factors.push('Severe sleep deprivation');
        else if (sleepHours < 7) factors.push('Insufficient sleep');
        if (sleepHours > 9) factors.push('Excessive sleep');
        return factors;
    }

    // ==================== DIGITAL WELLBEING RISK ====================
    calculateDigitalWellbeingRisk(data) {
        let score = 100;

        // Screen time (hours)
        const screenTime = parseFloat(data.screenTime) || 4;

        // Age-appropriate thresholds
        if (screenTime > 8) {
            score -= 40; // Severe overuse
        } else if (screenTime > 6) {
            score -= 25; // High usage
        } else if (screenTime > 4) {
            score -= 10; // Moderate usage
        }

        // Screen time trend
        if (data.history && data.history.length >= 7) {
            const recentScreen = data.history.slice(-7).map(d => parseFloat(d.screenTime) || 4);
            const avgScreen = recentScreen.reduce((a, b) => a + b, 0) / recentScreen.length;

            if (avgScreen > 6) score -= 15; // Consistent overuse

            // Check if increasing
            const recent3 = recentScreen.slice(-3).reduce((a, b) => a + b, 0) / 3;
            const prev3 = recentScreen.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
            if (recent3 > prev3 + 1) score -= 10; // Increasing trend
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            color: this.getColorForScore(score),
            level: this.getLevelForScore(score),
            factors: this.getDigitalFactors(data)
        };
    }

    getDigitalFactors(data) {
        const factors = [];
        const screenTime = parseFloat(data.screenTime) || 4;
        if (screenTime > 8) factors.push('Excessive screen time');
        else if (screenTime > 6) factors.push('High screen time');
        else if (screenTime > 4) factors.push('Moderate screen time');
        return factors;
    }

    // ==================== PHYSICAL HEALTH RISK ====================
    calculatePhysicalHealthRisk(data) {
        let score = 100;

        // Physical activity (days per week)
        const activityDays = parseInt(data.physicalActivity) || 3;

        // WHO recommends 5+ days
        if (activityDays === 0) {
            score -= 40; // Completely sedentary
        } else if (activityDays < 3) {
            score -= 25; // Insufficient activity
        } else if (activityDays < 5) {
            score -= 10; // Below recommendation
        }

        // Exercise consistency
        if (data.history && data.history.length >= 7) {
            const recentActivity = data.history.slice(-7).map(d => parseInt(d.physicalActivity) || 3);
            const avgActivity = recentActivity.reduce((a, b) => a + b, 0) / recentActivity.length;

            if (avgActivity < 2) score -= 15; // Chronic inactivity
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            color: this.getColorForScore(score),
            level: this.getLevelForScore(score),
            factors: this.getPhysicalFactors(data)
        };
    }

    getPhysicalFactors(data) {
        const factors = [];
        const activityDays = parseInt(data.physicalActivity) || 3;
        if (activityDays === 0) factors.push('No physical activity');
        else if (activityDays < 3) factors.push('Low physical activity');
        else if (activityDays < 5) factors.push('Moderate physical activity');
        return factors;
    }

    // ==================== OVERALL WELLBEING INDEX ====================
    calculateWellbeingIndex(risks) {
        const weightedScore =
            (risks.mentalHealth.score * this.riskCategories.mentalHealth.weight) +
            (risks.lifestyle.score * this.riskCategories.lifestyle.weight) +
            (risks.digitalWellbeing.score * this.riskCategories.digitalWellbeing.weight) +
            (risks.physicalHealth.score * this.riskCategories.physicalHealth.weight);

        return {
            score: Math.round(weightedScore),
            color: this.getColorForScore(weightedScore),
            level: this.getLevelForScore(weightedScore),
            breakdown: {
                mentalHealth: risks.mentalHealth.score,
                lifestyle: risks.lifestyle.score,
                digitalWellbeing: risks.digitalWellbeing.score,
                physicalHealth: risks.physicalHealth.score
            }
        };
    }

    // ==================== TREND DETECTION ====================
    detectTrend(data) {
        if (!data.history || data.history.length < 3) {
            return { direction: 'stable', change: 0 };
        }

        // Compare recent 3 days to previous 3 days
        const recent = data.history.slice(-3);
        const previous = data.history.slice(-6, -3);

        if (previous.length < 3 || recent.length < 3) {
            return { direction: 'stable', change: 0 };
        }

        // Calculate simple wellness metric for comparison
        const calcSimpleWellness = (entry) => {
            let score = 100;
            score -= (entry.stressLevel || 3) * 5;
            score -= (8 - (entry.sleepHours || 7)) * 5;
            score -= ((entry.screenTime || 4) - 4) * 3;
            score += ((entry.physicalActivity || 3) * 3);
            return score;
        };

        const recentAvg = recent.reduce((sum, e) => sum + calcSimpleWellness(e), 0) / recent.length;
        const prevAvg = previous.reduce((sum, e) => sum + calcSimpleWellness(e), 0) / previous.length;

        const change = recentAvg - prevAvg;

        if (change > 5) {
            return { direction: 'improving', change: Math.round(change), icon: '↑', color: 'var(--color-success)' };
        } else if (change < -5) {
            return { direction: 'worsening', change: Math.round(change), icon: '↓', color: 'var(--color-danger)' };
        } else {
            return { direction: 'stable', change: Math.round(change), icon: '→', color: 'var(--color-info)' };
        }
    }

    // ==================== PERSONA DETECTION ====================
    detectPersona(data, risks) {
        const screenTime = parseFloat(data.screenTime) || 4;
        const sleepHours = parseFloat(data.sleepHours) || 7;
        const stressLevel = data.stressLevel || 3;
        const academicPressure = data.academicPressure || 3;
        const activityDays = parseInt(data.physicalActivity) || 3;

        // Check conditions for each persona
        if (screenTime > 6) {
            return {
                type: 'screen-overloaded',
                emoji: '📱',
                title: 'Screen-Overloaded Student',
                message: 'Your screen time is higher than recommended. Let\'s find a healthy balance!',
                color: '#f59e0b',
                tips: [
                    'Try the 20-20-20 rule: Every 20 mins, look 20 feet away for 20 seconds',
                    'Set screen-free hours before bed',
                    'Use digital wellbeing apps to track usage'
                ]
            };
        }

        if ((stressLevel >= 4 || academicPressure >= 4) && sleepHours < 7) {
            return {
                type: 'burnt-out',
                emoji: '😰',
                title: 'You Might Be Feeling Burnt Out',
                message: 'High stress and lack of sleep can affect your wellbeing. Let\'s take care of you!',
                color: '#ef4444',
                tips: [
                    'Practice deep breathing for 5 minutes daily',
                    'Break study sessions into 25-minute chunks (Pomodoro)',
                    'Talk to your counselor - they\'re here to help!'
                ]
            };
        }

        if (sleepHours < 6.5) {
            return {
                type: 'sleep-deprived',
                emoji: '😴',
                title: 'Sleep-Deprived Student',
                message: 'Quality sleep is essential for learning and health. Let\'s improve your sleep routine!',
                color: '#8b5cf6',
                tips: [
                    'Go to bed at the same time every night',
                    'Avoid screens 1 hour before sleep',
                    'Create a relaxing bedtime routine'
                ]
            };
        }

        if (activityDays < 3) {
            return {
                type: 'sedentary',
                emoji: '🪑',
                title: 'Time to Get Moving!',
                message: 'Regular physical activity boosts mood, energy, and focus. Let\'s get active!',
                color: '#10b981',
                tips: [
                    'Start with 15-minute walks daily',
                    'Try desk stretches every hour',
                    'Join a sport or dance class'
                ]
            };
        }

        // Balanced student
        return {
            type: 'balanced',
            emoji: '✨',
            title: 'You\'re Doing Great!',
            message: 'Your wellness habits are balanced. Keep up the excellent work!',
            color: '#06b6d4',
            tips: [
                'Maintain your current healthy routine',
                'Help friends build healthy habits too',
                'Keep tracking to stay aware'
            ]
        };
    }

    // ==================== EXPLANATION GENERATOR ====================
    generateExplanations(data, risks) {
        const explanations = {};

        // Why wellbeing index changed
        const reasons = [];

        if (risks.mentalHealth.score < 60) {
            reasons.push('Your stress or academic pressure is elevated');
        }
        if (risks.lifestyle.score < 60) {
            reasons.push('Your sleep routine needs improvement');
        }
        if (risks.digitalWellbeing.score < 60) {
            reasons.push('Screen time is higher than recommended');
        }
        if (risks.physicalHealth.score < 60) {
            reasons.push('Physical activity could be increased');
        }

        if (reasons.length === 0) {
            reasons.push('You\'re maintaining healthy habits across all areas!');
        }

        explanations.whyThisChanged = reasons;
        explanations.mainFactor = this.getMainRiskFactor(risks);
        explanations.improvement = this.getImprovementSuggestion(risks);

        return explanations;
    }

    getMainRiskFactor(risks) {
        const scores = [
            { name: 'Mental Health', score: risks.mentalHealth.score },
            { name: 'Lifestyle', score: risks.lifestyle.score },
            { name: 'Digital Wellbeing', score: risks.digitalWellbeing.score },
            { name: 'Physical Health', score: risks.physicalHealth.score }
        ];

        const lowest = scores.reduce((min, curr) => curr.score < min.score ? curr : min);

        if (lowest.score >= 70) {
            return 'All areas are healthy!';
        }
        return `${lowest.name} needs attention`;
    }

    getImprovementSuggestion(risks) {
        if (risks.mentalHealth.score < 60) {
            return 'Try stress management techniques like meditation or talking to a counselor';
        }
        if (risks.lifestyle.score < 60) {
            return 'Focus on getting 7-9 hours of sleep each night';
        }
        if (risks.digitalWellbeing.score < 60) {
            return 'Reduce screen time by setting daily limits';
        }
        if (risks.physicalHealth.score < 60) {
            return 'Aim for 30 minutes of physical activity most days';
        }
        return 'Keep maintaining your healthy habits!';
    }

    // ==================== HELPER METHODS ====================
    getColorForScore(score) {
        if (score >= 70) return 'green';
        if (score >= 40) return 'yellow';
        return 'red';
    }

    getLevelForScore(score) {
        if (score >= 70) return 'Healthy';
        if (score >= 40) return 'Caution';
        return 'Needs Attention';
    }

    // ==================== ALERT DETECTION ====================
    shouldTriggerAlert(risks, history) {
        const alerts = [];

        // Critical: Overall wellbeing < 40 for 3+ days
        if (risks.wellbeingIndex.score < 40) {
            if (history && history.filter(h => h.wellbeingIndex < 40).length >= 3) {
                alerts.push({
                    level: 'critical',
                    type: 'sustained_low_wellbeing',
                    message: 'Sustained low wellbeing detected',
                    action: 'counselor_alert',
                    tier: 2
                });
            }
        }

        // High: Mental health < 40
        if (risks.mentalHealth.score < 40) {
            alerts.push({
                level: 'high',
                type: 'mental_health_risk',
                message: 'Mental health score is low',
                action: 'self_help_resources',
                tier: 1
            });
        }

        // Moderate: Any category < 50
        Object.keys(risks).forEach(category => {
            if (risks[category].score !== undefined && risks[category].score < 50) {
                alerts.push({
                    level: 'moderate',
                    type: `${category}_caution`,
                    message: `${category} score needs attention`,
                    action: 'show_tips',
                    tier: 0
                });
            }
        });

        return alerts;
    }
}

// Create global instance
const aiEngine = new AIRiskEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIRiskEngine, aiEngine };
}
