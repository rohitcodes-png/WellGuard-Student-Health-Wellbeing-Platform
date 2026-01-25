// Alert System - Tiered ethical alerts
// Implements self-help → counselor → parent → institution escalation

class AlertSystem {
    constructor() {
        this.alertTiers = {
            0: { name: 'Self-Help', action: 'show_resources', color: '#10b981' },
            1: { name: 'Counselor Notification', action: 'notify_counselor', color: '#f59e0b' },
            2: { name: 'Parent Alert', action: 'notify_parent', color: '#ef4444' },
            3: { name: 'Institution Emergency', action: 'emergency_protocol', color: '#dc2626' }
        };

        this.alertHistory = [];
    }

    // ==================== ALERT EVALUATION ====================
    evaluateAlerts(studentData, risks) {
        const alerts = [];
        const wellbeingScore = risks.wellbeingIndex.score;

        // Tier 0: Self-Help (Green → Yellow transition)
        if (wellbeingScore < 70 && wellbeingScore >= 40) {
            alerts.push(this.createAlert(0, 'wellbeing_declining', studentData, risks));
        }

        // Tier 1: Counselor (Yellow → Red or sustained yellow)
        if (wellbeingScore < 40) {
            const sustainedLow = this.checkSustainedCondition(studentData.history, 'wellbeingIndex', 40, 3);
            if (sustainedLow) {
                alerts.push(this.createAlert(1, 'sustained_low_wellbeing', studentData, risks));
            }
        }

        // Check specific category risks
        if (risks.mentalHealth.score < 40) {
            alerts.push(this.createAlert(1, 'mental_health_risk', studentData, risks));
        }

        // Tier 2: Parent (with consent, sustained red)
        if (wellbeingScore < 30) {
            const consentGiven = this.checkParentConsent(studentData.studentId);
            if (consentGiven) {
                alerts.push(this.createAlert(2, 'critical_wellbeing', studentData, risks));
            }
        }

        // Tier 3: Emergency (SOS or severe crisis indicators)
        if (studentData.sosPressed || this.detectCrisisIndicators(risks)) {
            alerts.push(this.createAlert(3, 'emergency_support_needed', studentData, risks));
        }

        return alerts;
    }

    // ==================== CREATE ALERT ====================
    createAlert(tier, type, studentData, risks) {
        const alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            tier,
            type,
            tierInfo: this.alertTiers[tier],
            studentId: studentData.studentId,
            studentName: studentData.studentName,
            timestamp: new Date().toISOString(),

            // Why this alert triggered
            reason: this.generateAlertReason(type, risks),

            // Recommended action
            recommendedAction: this.getRecommendedAction(tier, type),

            // Resources
            resources: this.getRelevantResources(type, risks),

            // Consent status
            consentStatus: this.checkParentConsent(studentData.studentId),

            // Risk snapshot
            riskSnapshot: {
                wellbeingIndex: risks.wellbeingIndex.score,
                mentalHealth: risks.mentalHealth.score,
                lifestyle: risks.lifestyle.score,
                digitalWellbeing: risks.digitalWellbeing.score,
                physicalHealth: risks.physicalHealth.score,
                persona: risks.persona.type
            },

            status: 'new', // new, acknowledged, resolved
            assignedTo: tier >= 1 ? 'counselor' : null
        };

        // Store in history
        this.alertHistory.push(alert);
        this.saveAlertToStorage(alert);

        return alert;
    }

    // ==================== ALERT REASONS ====================
    generateAlertReason(type, risks) {
        const reasons = {
            'wellbeing_declining': `Wellbeing score decreased to ${risks.wellbeingIndex.score}. Early intervention recommended.`,

            'sustained_low_wellbeing': `Wellbeing score has remained below 40 for 3+ days. Consistent support needed.`,

            'mental_health_risk': `Mental health score is ${risks.mentalHealth.score}. ${risks.mentalHealth.factors.join(', ')}.`,

            'critical_wellbeing': `Critical wellbeing level detected (${risks.wellbeingIndex.score}). Immediate attention recommended.`,

            'emergency_support_needed': 'Emergency support requested or severe crisis indicators detected.'
        };

        return reasons[type] || 'Wellbeing concern detected';
    }

    // ==================== RECOMMENDED ACTIONS ====================
    getRecommendedAction(tier, type) {
        const actions = {
            0: {
                title: 'Self-Help Resources',
                steps: [
                    'Review personalized wellness tips',
                    'Try breathing exercises or meditation',
                    'Connect with peer support groups',
                    'Track improvements over next 3 days'
                ]
            },
            1: {
                title: 'Counselor Check-In',
                steps: [
                    'Counselor will reach out within 24 hours',
                    'Share your concerns openly',
                    'Together create an action plan',
                    'Follow-up scheduled automatically'
                ]
            },
            2: {
                title: 'Family Support',
                steps: [
                    'Parent notified with supportive message',
                    'Counselor coordinates with family',
                    'Regular check-ins scheduled',
                    'Professional resources provided if needed'
                ]
            },
            3: {
                title: 'Emergency Protocol',
                steps: [
                    'Immediate counselor alert',
                    'Parents contacted immediately',
                    'Emergency support numbers provided',
                    'Institution support team activated'
                ]
            }
        };

        return actions[tier];
    }

    // ==================== RESOURCES ====================
    getRelevantResources(type, risks) {
        const baseResources = [
            { name: 'National Mental Health Helpline', number: '1860-2662-345', available: '24/7' },
            { name: 'NIMHANS Helpline', number: '080-46110007', available: '24/7' }
        ];

        const specificResources = {
            'mental_health_risk': [
                { type: 'article', title: 'Managing Academic Stress', link: '#' },
                { type: 'video', title: 'Breathing Exercises for Anxiety', link: '#' },
                { type: 'counselor', title: 'Book Counseling Session', link: '#' }
            ],
            'wellbeing_declining': [
                { type: 'article', title: 'Building Healthy Daily Routines', link: '#' },
                { type: 'activity', title: 'Join Wellness Challenge', link: '#' }
            ]
        };

        return {
            helplines: baseResources,
            content: specificResources[type] || []
        };
    }

    // ==================== CHECKS ====================
    checkSustainedCondition(history, metric, threshold, days) {
        if (!history || history.length < days) return false;

        const recent = history.slice(-days);
        return recent.every(entry => entry[metric] < threshold);
    }

    checkParentConsent(studentId) {
        // Check if parent has consented to receive alerts
        const consent = localStorage.getItem(`parent_consent_${studentId}`);
        return consent === 'true';
    }

    detectCrisisIndicators(risks) {
        // Multiple red flags
        const redFlags = [
            risks.mentalHealth.score < 30,
            risks.lifestyle.score < 30,
            risks.wellbeingIndex.score < 25
        ];

        return redFlags.filter(flag => flag).length >= 2;
    }

    // ==================== STORAGE ====================
    saveAlertToStorage(alert) {
        const alerts = JSON.parse(localStorage.getItem('studentAlerts') || '[]');
        alerts.push(alert);
        localStorage.setItem('studentAlerts', JSON.stringify(alerts));
    }

    getAlertsForStudent(studentId) {
        const alerts = JSON.parse(localStorage.getItem('studentAlerts') || '[]');
        return alerts.filter(a => a.studentId === studentId);
    }

    getAlertsForCounselor(counselorId) {
        // In production, filter by assigned counselor
        const alerts = JSON.parse(localStorage.getItem('studentAlerts') || '[]');
        return alerts.filter(a => a.tier >= 1 && a.status !== 'resolved');
    }

    acknowledgeAlert(alertId, userId) {
        const alerts = JSON.parse(localStorage.getItem('studentAlerts') || '[]');
        const alert = alerts.find(a => a.id === alertId);

        if (alert) {
            alert.status = 'acknowledged';
            alert.acknowledgedBy = userId;
            alert.acknowledgedAt = new Date().toISOString();
            localStorage.setItem('studentAlerts', JSON.stringify(alerts));
        }

        return alert;
    }

    resolveAlert(alertId, userId, notes) {
        const alerts = JSON.parse(localStorage.getItem('studentAlerts') || '[]');
        const alert = alerts.find(a => a.id === alertId);

        if (alert) {
            alert.status = 'resolved';
            alert.resolvedBy = userId;
            alert.resolvedAt = new Date().toISOString();
            alert.resolutionNotes = notes;
            localStorage.setItem('studentAlerts', JSON.stringify(alerts));
        }

        return alert;
    }

    // ==================== PARENT NOTIFICATIONS ====================
    generateParentNotification(alert, studentProgress) {
        // Always positive, supportive tone
        if (alert.tier < 2) {
            // Don't notify parents for tier 0-1 unless critical
            return null;
        }

        const positiveFraming = {
            'critical_wellbeing': `We noticed ${alert.studentName} might benefit from some extra support right now. Our counselor is reaching out to help them build healthy routines. Your encouragement means a lot! 💚`,

            'sustained_low_wellbeing': `${alert.studentName} is working through some challenges. Our team is providing support and resources. Remember to celebrate small wins with them! 🌟`
        };

        return {
            title: 'Supporting Your Child\'s Wellbeing',
            message: positiveFraming[alert.type] || 'We\'re here to support your child\'s wellness journey.',
            tone: 'supportive',
            actionable: true,
            suggestions: [
                'Have a casual, non-judgmental chat',
                'Acknowledge their efforts, not just results',
                'Ensure they know help is available',
                'Maintain normal routines and boundaries'
            ],
            counselorContact: 'Available for discussion if you have questions'
        };
    }
}

// Create global instance
const alertSystem = new AlertSystem();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AlertSystem, alertSystem };
}
