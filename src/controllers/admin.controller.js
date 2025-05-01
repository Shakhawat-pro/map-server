import { User } from "../models/User.js";
import { Event } from "../models/Event.js";

const isAdmin = async (req, res) => {
    try {
        // By default, use the email from the decoded token
        const email = req.query.email

        if (email !== req.decoded.email) {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }
        const query = { email: email }

        if (req.query.email) {
            const user = await User.findOne(query);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    isAdmin: false
                });
            }
            return res.status(200).json({
                success: true,
                message: "Admin status checked successfully",
                isAdmin: user.role === 'admin'
            });
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
            isAdmin: false
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        // Event statistics
        const [totalEvents, approvedEvents, rejectedEvents, pendingEvents,
            upcomingEvents, newEvents, endedEvents, closingSoonEvents] = await Promise.all([
                Event.countDocuments(),
                Event.countDocuments({ status: 'approved' }),
                Event.countDocuments({ status: 'rejected' }),
                Event.countDocuments({ status: 'pending' }),
                Event.countDocuments({ statusBadge: 'New' }),
                Event.countDocuments({ statusBadge: 'Upcoming' }),
                Event.countDocuments({ statusBadge: 'Closing Soon' }),
                Event.countDocuments({ statusBadge: 'Ended' })
            ]);

        // User statistics
        const [totalUsers, adminUsers, guestUsers] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ role: 'guest' })
        ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            stats: {
                events: {
                    total: totalEvents,
                    approved: approvedEvents,
                    rejected: rejectedEvents,
                    pending: pendingEvents,
                    upcoming: upcomingEvents,
                    new: newEvents,
                    ended: endedEvents,
                    closingSoon: closingSoonEvents
                },
                users: {
                    total: totalUsers,
                    admin: adminUsers,
                    guest: guestUsers
                }
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};

export const adminController = {
    isAdmin,
    getDashboardStats
}






{ /* 
    
            const [totalEvents, approvedEvents, rejectedEvents, pendingEvents,
               upcomingEvents, newEvents, endedEvents, closingSoonEvents] = await Promise.all([
            Event.countDocuments(),
            Event.countDocuments({ status: 'approved' }),
            Event.countDocuments({ status: 'rejected' }),
            Event.countDocuments({ status: 'pending' }),
            Event.countDocuments({ startDate: { $gt: new Date() } }),
            Event.countDocuments({ createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
            Event.countDocuments({ endDate: { $lt: new Date() } }),
            Event.countDocuments({
                endDate: {
                    $gt: new Date(),
                    $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                }
            })
        ]);
    
    
    
    */}