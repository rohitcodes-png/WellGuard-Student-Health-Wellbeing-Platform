// Mock Data Store
// Comprehensive realistic data for demonstration

const mockData = {
    // User accounts for demo
    users: {
        'student1': {
            id: 's001',
            username: 'student1',
            password: 'student123',
            role: 'student',
            name: 'Aarav Sharma',
            email: 'aarav.sharma@student.edu.in',
            age: 17,
            grade: '12th',
            institution: 'Delhi Public School',
            registeredDate: '2025-01-01'
        },
        'parent1': {
            id: 'p001',
            username: 'parent1',
            password: 'parent123',
            role: 'parent',
            name: 'Mrs. Priya Sharma',
            email: 'priya.sharma@email.com',
            linkedStudent: 's001',
            consentGiven: true
        },
        'counselor1': {
            id: 'c001',
            username: 'counselor1',
            password: 'counselor123',
            role: 'counselor',
            name: 'Dr. Rajesh Kumar',
            email: 'rajesh.kumar@school.edu.in',
            specialization: 'Mental Health',
            assignedStudents: ['s001', 's002', 's003']
        },
        'admin1': {
            id: 'a001',
            username: 'admin1',
            password: 'admin123',
            role: 'admin',
            name: 'Mr. Suresh Patel',
            email: 'suresh.patel@school.edu.in',
            institution: 'Delhi Public School'
        }
    },

    // Student health and wellness data
    studentData: {
        's001': {
            wellnessScore: 78,
            pointsBalance: 1250,
            tasksCompleted: 45,
            activityStreak: 7,

            // Physical Health Metrics
            physicalHealth: {
                healthScore: 82,
                avgStepsPerDay: 8500,
                avgExerciseMins: 35,
                avgSittingHours: 4,
                bmi: 21.5,
                lastUpdated: '2026-01-24'
            },

            // Mental Wellness Metrics
            mentalWellness: {
                stressLevel: 'moderate',
                sleepQuality: 7.5,
                avgSleepHours: 7,
                moodTrend: 'improving',
                lastAssessment: '2026-01-23'
            },

            // Digital Wellbeing
            digitalWellbeing: {
                avgScreenTime: 4.5,
                socialMediaHours: 2,
                studyAppHours: 1.5,
                entertainmentHours: 1,
                detoxStreak: 3
            },

            // To-Do Tasks
            tasks: [
                {
                    id: 't001',
                    title: 'Complete Math Assignment',
                    category: 'study',
                    difficulty: 'medium',
                    deadline: '2026-01-26',
                    completed: false,
                    points: 50
                },
                {
                    id: 't002',
                    title: 'Morning Yoga (30 mins)',
                    category: 'exercise',
                    difficulty: 'easy',
                    deadline: '2026-01-25',
                    completed: true,
                    points: 30
                },
                {
                    id: 't003',
                    title: 'Sleep by 10 PM',
                    category: 'sleep',
                    difficulty: 'medium',
                    deadline: '2026-01-25',
                    completed: true,
                    points: 25
                },
                {
                    id: 't004',
                    title: 'Digital Detox (No phone after 9 PM)',
                    category: 'digital_detox',
                    difficulty: 'hard',
                    deadline: '2026-01-25',
                    completed: false,
                    points: 40
                },
                {
                    id: 't005',
                    title: 'Meditation - 15 minutes',
                    category: 'mental_wellness',
                    difficulty: 'easy',
                    deadline: '2026-01-26',
                    completed: false,
                    points: 20
                }
            ],

            // Exercise Log
            exercises: [
                {
                    id: 'e001',
                    type: 'running',
                    duration: 30,
                    steps: 4200,
                    date: '2026-01-24',
                    points: 30
                },
                {
                    id: 'e002',
                    type: 'yoga',
                    duration: 25,
                    date: '2026-01-24',
                    points: 25
                },
                {
                    id: 'e003',
                    type: 'cycling',
                    duration: 40,
                    date: '2026-01-23',
                    points: 40
                }
            ],

            // Timetable
            timetable: [
                { day: 'Monday', time: '08:00-09:00', subject: 'Mathematics', type: 'class' },
                { day: 'Monday', time: '09:00-10:00', subject: 'Physics', type: 'class' },
                { day: 'Monday', time: '10:00-10:30', subject: 'Break', type: 'break' },
                { day: 'Monday', time: '10:30-11:30', subject: 'Chemistry', type: 'class' },
                { day: 'Monday', time: '16:00-17:00', subject: 'Study Time', type: 'study' },
                { day: 'Monday', time: '17:00-18:00', subject: 'Exercise', type: 'exercise' }
            ],

            // Exam Schedule
            exams: [
                {
                    id: 'ex001',
                    subject: 'Mathematics',
                    date: '2026-02-01',
                    time: '10:00 AM',
                    duration: '3 hours',
                    syllabus: '80%',
                    preparationStatus: 'on-track'
                },
                {
                    id: 'ex002',
                    subject: 'Physics',
                    date: '2026-02-03',
                    time: '10:00 AM',
                    duration: '3 hours',
                    syllabus: '65%',
                    preparationStatus: 'needs-attention'
                },
                {
                    id: 'ex003',
                    subject: 'Chemistry',
                    date: '2026-02-05',
                    time: '10:00 AM',
                    duration: '3 hours',
                    syllabus: '75%',
                    preparationStatus: 'on-track'
                }
            ],

            // Points Transaction History
            pointsHistory: [
                { date: '2026-01-24', activity: 'Completed yoga session', points: 30, type: 'earned' },
                { date: '2026-01-24', activity: 'Achieved sleep goal', points: 25, type: 'earned' },
                { date: '2026-01-23', activity: 'Completed cycling activity', points: 40, type: 'earned' },
                { date: '2026-01-22', activity: 'Redeemed: Notebook Set', points: -100, type: 'redeemed' },
                { date: '2026-01-21', activity: 'Weekly study streak bonus', points: 50, type: 'earned' }
            ]
        }
    },

    // Parent notifications (positive reinforcement)
    parentNotifications: {
        'p001': [
            {
                id: 'n001',
                date: '2026-01-24',
                type: 'positive',
                title: 'Excellent Progress This Week!',
                message: 'Aarav has maintained a consistent exercise routine for 7 days straight. Great dedication!',
                icon: '🎉'
            },
            {
                id: 'n002',
                date: '2026-01-23',
                type: 'positive',
                title: 'Healthy Sleep Pattern',
                message: 'Your child has been achieving 7+ hours of sleep consistently. Wonderful health habits!',
                icon: '😴'
            },
            {
                id: 'n003',
                date: '2026-01-22',
                type: 'positive',
                title: 'Academic Milestone',
                message: 'Aarav completed all study tasks on time this week. Excellent time management!',
                icon: '📚'
            }
        ]
    },

    // Counselor alerts (early warnings)
    counselorAlerts: {
        'c001': [
            {
                id: 'a001',
                studentId: 's002',
                studentName: 'Priya Singh',
                severity: 'moderate',
                type: 'mental_health',
                alert: 'Declining mood trend observed over past 2 weeks',
                date: '2026-01-24',
                status: 'new'
            },
            {
                id: 'a002',
                studentId: 's003',
                studentName: 'Rahul Verma',
                severity: 'low',
                type: 'physical_health',
                alert: 'Decreased physical activity - sedentary hours increasing',
                date: '2026-01-23',
                status: 'acknowledged'
            },
            {
                id: 'a003',
                studentId: 's001',
                studentName: 'Aarav Sharma',
                severity: 'low',
                type: 'academic',
                alert: 'Physics exam preparation behind schedule',
                date: '2026-01-22',
                status: 'resolved'
            }
        ]
    },

    // Admin analytics data
    adminAnalytics: {
        overallStats: {
            totalStudents: 1250,
            activeUsers: 1180,
            avgWellnessScore: 74,
            atRiskStudents: 45,
            interventionsThisMonth: 23
        },

        trendsData: {
            wellnessScores: [
                { month: 'Sep', avg: 68 },
                { month: 'Oct', avg: 71 },
                { month: 'Nov', avg: 72 },
                { month: 'Dec', avg: 73 },
                { month: 'Jan', avg: 74 }
            ],
            exerciseParticipation: [
                { month: 'Sep', percentage: 52 },
                { month: 'Oct', percentage: 58 },
                { month: 'Nov', percentage: 62 },
                { month: 'Dec', percentage: 60 },
                { month: 'Jan', percentage: 67 }
            ],
            stressLevels: {
                low: 45,
                moderate: 42,
                high: 13
            },
            screenTimeDistribution: {
                healthy: 38,
                moderate: 47,
                excessive: 15
            }
        },

        riskPatterns: [
            { category: 'Exam Stress', affected: 187, trend: 'increasing', correlation: 'Upcoming board exams' },
            { category: 'Low Physical Activity', affected: 95, trend: 'stable', correlation: 'Winter season' },
            { category: 'Sleep Deprivation', affected: 142, trend: 'decreasing', correlation: 'Wellness campaign effective' },
            { category: 'Digital Overuse', affected: 203, trend: 'increasing', correlation: 'New smartphone policies needed' }
        ]
    },

    // Rewards catalog
    rewards: {
        stationery: [
            { id: 'r001', name: 'Premium Notebook Set', points: 100, stock: 50, image: '📓' },
            { id: 'r002', name: 'Quality Pen Set', points: 75, stock: 100, image: '🖊️' },
            { id: 'r003', name: 'Study Planner', points: 150, stock: 30, image: '📅' },
            { id: 'r004', name: 'Highlighter Set', points: 50, stock: 75, image: '🖍️' }
        ],
        wellness: [
            { id: 'r005', name: 'Extra Break Credit (15 mins)', points: 200, stock: 'unlimited', image: '⏰' },
            { id: 'r006', name: 'Yoga Class Pass', points: 250, stock: 20, image: '🧘' },
            { id: 'r007', name: 'Sports Equipment Voucher', points: 300, stock: 15, image: '⚽' }
        ],
        campus: [
            { id: 'r008', name: 'Library Late Pass', points: 180, stock: 25, image: '📚' },
            { id: 'r009', name: 'Cafeteria Voucher', points: 120, stock: 50, image: '🍽️' },
            { id: 'r010', name: 'Campus Event Priority', points: 350, stock: 10, image: '🎫' }
        ]
    },

    // Emergency contacts
    emergencyContacts: {
        nationalHelplines: [
            { name: 'National Mental Health Helpline', number: '1800-599-0019', available: '24/7' },
            { name: 'NIMHANS Crisis Helpline', number: '080-46110007', available: '24/7' },
            { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7' }
        ],
        institutionContacts: [
            { name: 'School Counselor', number: '+91-98765-43210', available: 'Mon-Sat 9AM-5PM' },
            { name: 'Principal Office', number: '+91-98765-43211', available: 'Mon-Fri 9AM-5PM' },
            { name: 'Medical Room', number: '+91-98765-43212', available: 'Mon-Sat 8AM-4PM' }
        ]
    }
};

// Helper functions for data access
const dataService = {
    // Authenticate user
    authenticate(username, password) {
        const user = mockData.users[username];
        if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    },

    // Get student data
    getStudentData(studentId) {
        return mockData.studentData[studentId] || null;
    },

    // Get parent notifications
    getParentNotifications(parentId) {
        return mockData.parentNotifications[parentId] || [];
    },

    // Get counselor alerts
    getCounselorAlerts(counselorId) {
        return mockData.counselorAlerts[counselorId] || [];
    },

    // Get admin analytics
    getAdminAnalytics() {
        return mockData.adminAnalytics;
    },

    // Get rewards catalog
    getRewards() {
        return mockData.rewards;
    },

    // Get emergency contacts
    getEmergencyContacts() {
        return mockData.emergencyContacts;
    },

    // Add task
    addTask(studentId, task) {
        if (mockData.studentData[studentId]) {
            const newTask = {
                id: 't' + Date.now(),
                ...task,
                completed: false
            };
            mockData.studentData[studentId].tasks.push(newTask);
            return newTask;
        }
        return null;
    },

    // Toggle task completion
    toggleTask(studentId, taskId) {
        if (mockData.studentData[studentId]) {
            const task = mockData.studentData[studentId].tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;

                // Award points if completed
                if (task.completed) {
                    mockData.studentData[studentId].pointsBalance += task.points;
                    mockData.studentData[studentId].tasksCompleted += 1;

                    // Add to points history
                    mockData.studentData[studentId].pointsHistory.unshift({
                        date: new Date().toISOString().split('T')[0],
                        activity: `Completed: ${task.title}`,
                        points: task.points,
                        type: 'earned'
                    });

                    // Check if should trigger positive parent notification
                    this.checkPositiveNotification(studentId);
                } else {
                    mockData.studentData[studentId].pointsBalance -= task.points;
                    mockData.studentData[studentId].tasksCompleted -= 1;
                }

                return task;
            }
        }
        return null;
    },

    // Log exercise
    logExercise(studentId, exercise) {
        if (mockData.studentData[studentId]) {
            const newExercise = {
                id: 'e' + Date.now(),
                ...exercise,
                date: new Date().toISOString().split('T')[0],
                points: Math.floor(exercise.duration * 0.75) // 0.75 points per minute
            };

            mockData.studentData[studentId].exercises.unshift(newExercise);
            mockData.studentData[studentId].pointsBalance += newExercise.points;

            // Add to points history
            mockData.studentData[studentId].pointsHistory.unshift({
                date: newExercise.date,
                activity: `${exercise.type} - ${exercise.duration} mins`,
                points: newExercise.points,
                type: 'earned'
            });

            // Update activity streak
            this.updateActivityStreak(studentId);

            return newExercise;
        }
        return null;
    },

    // Redeem reward
    redeemReward(studentId, rewardId, pointsCost) {
        if (mockData.studentData[studentId]) {
            if (mockData.studentData[studentId].pointsBalance >= pointsCost) {
                mockData.studentData[studentId].pointsBalance -= pointsCost;

                // Add to points history
                const reward = this.findReward(rewardId);
                mockData.studentData[studentId].pointsHistory.unshift({
                    date: new Date().toISOString().split('T')[0],
                    activity: `Redeemed: ${reward.name}`,
                    points: -pointsCost,
                    type: 'redeemed'
                });

                return true;
            }
        }
        return false;
    },

    // Find reward by ID
    findReward(rewardId) {
        for (const category in mockData.rewards) {
            const reward = mockData.rewards[category].find(r => r.id === rewardId);
            if (reward) return reward;
        }
        return null;
    },

    // Update activity streak
    updateActivityStreak(studentId) {
        // Simplified: increment streak
        if (mockData.studentData[studentId]) {
            mockData.studentData[studentId].activityStreak += 1;
        }
    },

    // Check if positive parent notification should be triggered
    checkPositiveNotification(studentId) {
        const student = mockData.studentData[studentId];
        const user = Object.values(mockData.users).find(u => u.id === studentId);

        // Find parent
        const parent = Object.values(mockData.users).find(u => u.role === 'parent' && u.linkedStudent === studentId);

        if (parent && student) {
            // Check if student has completed 3 tasks in a row
            const recentTasks = student.tasks.slice(-3);
            if (recentTasks.every(t => t.completed)) {
                // Trigger positive notification
                if (!mockData.parentNotifications[parent.id]) {
                    mockData.parentNotifications[parent.id] = [];
                }

                mockData.parentNotifications[parent.id].unshift({
                    id: 'n' + Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    type: 'positive',
                    title: 'Wonderful Consistency!',
                    message: `${user.name} is maintaining excellent task completion habits. Keep encouraging them!`,
                    icon: '⭐'
                });
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockData, dataService };
}
