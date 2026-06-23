import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

/**
 * Format a Date object to YYYY-MM-DD string in local time
 */
const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * GET /api/hod/analytics
 * Retrieve department-wide gate pass statistics and currently active outpasses
 */
export const getHodAnalytics = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log(`📊 Fetching HOD analytics for user: ${user.email}`);

    // Today's boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Run parallel counts
    const [
      totalOutpasses,
      approvedOutpasses,
      rejectedOutpasses,
      pendingOutpasses,
      utilizedOutpasses,
      todayTotal,
      todayApproved,
      todayPending,
      todayRejected,
      todayUtilized,
      studentsOutside
    ] = await Promise.all([
      // Overall counts
      prisma.gatePass.count(),
      prisma.gatePass.count({ where: { status: 'APPROVED' } }),
      prisma.gatePass.count({ where: { status: 'REJECTED' } }),
      prisma.gatePass.count({ where: { status: 'PENDING' } }),
      prisma.gatePass.count({ where: { status: 'UTILIZED' } }),
      // Today counts
      prisma.gatePass.count({ where: { appliedAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.gatePass.count({ where: { appliedAt: { gte: todayStart, lte: todayEnd }, status: 'APPROVED' } }),
      prisma.gatePass.count({ where: { appliedAt: { gte: todayStart, lte: todayEnd }, status: 'PENDING' } }),
      prisma.gatePass.count({ where: { appliedAt: { gte: todayStart, lte: todayEnd }, status: 'REJECTED' } }),
      prisma.gatePass.count({ where: { appliedAt: { gte: todayStart, lte: todayEnd }, status: 'UTILIZED' } }),
      // Students Currently Outside (status = APPROVED, qrValid = true, scannedAt = null)
      prisma.gatePass.findMany({
        where: {
          status: 'APPROVED',
          qrValid: true,
          scannedAt: null
        },
        include: {
          student: {
            select: {
              id: true,
              email: true,
              name: true,
              mobile: true
            }
          },
          mentor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          appliedAt: 'desc'
        }
      })
    ]);

    const stats = {
      summary: {
        total: totalOutpasses,
        approved: approvedOutpasses,
        rejected: rejectedOutpasses,
        pending: pendingOutpasses,
        utilized: utilizedOutpasses,
        activeOutside: studentsOutside.length
      },
      today: {
        total: todayTotal,
        approved: todayApproved,
        pending: todayPending,
        rejected: todayRejected,
        utilized: todayUtilized
      },
      studentsOutside
    };

    console.log('✅ HOD Analytics generated successfully');
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching HOD analytics:', error);
    res.status(500).json({ error: 'Failed to fetch HOD analytics' });
  }
};

/**
 * GET /api/hod/trends
 * Retrieve 7-day outpass trends, reason distribution, approval stats, and peak usage periods
 */
export const getHodTrends = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log(`📈 Fetching HOD trends for user: ${user.email}`);

    // Last 7 days boundary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Last 30 days boundary for peak usage trends
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      passesLast7Days,
      statusGroups,
      reasonGroups,
      passesForTrends
    ] = await Promise.all([
      // Outpasses in the last 7 days
      prisma.gatePass.findMany({
        where: {
          appliedAt: {
            gte: sevenDaysAgo
          }
        },
        select: {
          appliedAt: true,
          status: true
        }
      }),
      // Status breakdown
      prisma.gatePass.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),
      // Common reasons
      prisma.gatePass.groupBy({
        by: ['reason'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      }),
      // Last 30 days for general trends (peak day and hour)
      prisma.gatePass.findMany({
        where: {
          appliedAt: {
            gte: thirtyDaysAgo
          }
        },
        select: {
          appliedAt: true
        }
      })
    ]);

    // 1. Process Daily Trends for last 7 days
    const dailyCounts = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      return {
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };
    }).reverse();

    passesLast7Days.forEach(pass => {
      const dateStr = formatDate(pass.appliedAt);
      const day = dailyCounts.find(d => d.date === dateStr);
      if (day) {
        day.total++;
        if (pass.status === 'APPROVED' || pass.status === 'UTILIZED') {
          day.approved++;
        } else if (pass.status === 'REJECTED') {
          day.rejected++;
        } else if (pass.status === 'PENDING') {
          day.pending++;
        }
      }
    });

    // 2. Process Approval/Rejection stats
    const statsSummary = {
      APPROVED: 0,
      REJECTED: 0,
      PENDING: 0,
      UTILIZED: 0,
      ESCALATED: 0,
      total: 0
    };

    statusGroups.forEach(g => {
      const status = g.status as keyof typeof statsSummary;
      if (status in statsSummary) {
        statsSummary[status] = g._count.id;
      }
      statsSummary.total += g._count.id;
    });

    const totalResolved = statsSummary.APPROVED + statsSummary.UTILIZED + statsSummary.REJECTED;
    const approvalRate = totalResolved > 0 
      ? Math.round(((statsSummary.APPROVED + statsSummary.UTILIZED) / totalResolved) * 100) 
      : 0;

    // 3. Process common reasons
    const commonReasons = reasonGroups.map(g => ({
      reason: g.reason,
      count: g._count.id
    }));

    // 4. Process Peak Usage trends (day of week & hours)
    const dayOfWeekCounts = Array(7).fill(0);
    const hourlyCounts = Array(24).fill(0);

    passesForTrends.forEach(p => {
      const day = p.appliedAt.getDay(); // 0 = Sunday, 1 = Monday, etc.
      dayOfWeekCounts[day]++;
      const hour = p.appliedAt.getHours();
      hourlyCounts[hour]++;
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakDayIndex = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));
    const peakDay = dayOfWeekCounts[peakDayIndex] > 0 ? dayNames[peakDayIndex] : 'N/A';

    const peakHourIndex = hourlyCounts.indexOf(Math.max(...hourlyCounts));
    const formatHour = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHr = h % 12 || 12;
      return `${displayHr} ${ampm}`;
    };
    const peakHourRange = hourlyCounts[peakHourIndex] > 0 
      ? `${formatHour(peakHourIndex)} - ${formatHour((peakHourIndex + 1) % 24)}` 
      : 'N/A';

    console.log('✅ HOD Trends generated successfully');
    res.json({
      dailyTrends: dailyCounts,
      statsSummary: {
        ...statsSummary,
        approvalRate
      },
      commonReasons,
      peakUsage: {
        peakDay,
        peakHourRange
      }
    });

  } catch (error) {
    console.error('❌ Error fetching HOD trends:', error);
    res.status(500).json({ error: 'Failed to fetch HOD trends' });
  }
};

/**
 * GET /api/hod/student-activity
 * Retrieve student outpass activity statistics and usage flags (High Usage >= 10)
 */
export const getStudentActivity = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log(`👥 Fetching HOD Student Activity Monitoring for HOD: ${user.email}`);

    // Fetch all students (role = STUDENT) and their passes
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        gatePasses: {
          select: {
            status: true,
            appliedAt: true,
            reason: true
          }
        }
      }
    });

    const activityData = students.map(student => {
      const total = student.gatePasses.length;
      
      let approvedCount = 0;
      let rejectedCount = 0;
      let pendingCount = 0;
      let lastOutpassDate: Date | null = null;
      const reasonMap: Record<string, number> = {};

      student.gatePasses.forEach(pass => {
        // Counts
        if (pass.status === 'APPROVED' || pass.status === 'UTILIZED') {
          approvedCount++;
        } else if (pass.status === 'REJECTED') {
          rejectedCount++;
        } else if (pass.status === 'PENDING') {
          pendingCount++;
        }

        // Last outpass date
        if (!lastOutpassDate || pass.appliedAt > lastOutpassDate) {
          lastOutpassDate = pass.appliedAt;
        }

        // Most common reason
        const reason = pass.reason.trim();
        reasonMap[reason] = (reasonMap[reason] || 0) + 1;
      });

      // Find most common reason
      let mostCommonReason = 'N/A';
      let maxCount = 0;
      for (const [reason, count] of Object.entries(reasonMap)) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonReason = reason;
        }
      }

      const usageStatus = total >= 10 ? 'High Usage' : 'Normal';

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        total,
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
        lastOutpassDate: lastOutpassDate ? (lastOutpassDate as Date).toISOString() : null,
        mostCommonReason,
        usageStatus
      };
    });

    // Sort by total outpasses descending so active students are at top by default
    activityData.sort((a, b) => b.total - a.total);

    console.log(`✅ Returned activity monitoring data for ${activityData.length} students`);
    res.json(activityData);
  } catch (error) {
    console.error('❌ Error fetching student activity data:', error);
    res.status(500).json({ error: 'Failed to fetch student activity data' });
  }
};

/**
 * GET /api/hod/outpasses
 * Retrieve filtered outpass records for HOD details page
 */
export const getHodOutpasses = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { filter } = req.query;
    console.log(`📊 Fetching HOD outpass details. Filter: ${filter}, User: ${user.email}`);

    // Today's boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const whereClause: any = {};

    if (filter === 'approved') {
      whereClause.status = 'APPROVED';
    } else if (filter === 'pending') {
      whereClause.status = 'PENDING';
    } else if (filter === 'rejected') {
      whereClause.status = 'REJECTED';
    } else if (filter === 'utilized') {
      whereClause.status = 'UTILIZED';
    } else if (filter === 'today') {
      whereClause.appliedAt = { gte: todayStart, lte: todayEnd };
    } else if (filter === 'today-approved') {
      whereClause.appliedAt = { gte: todayStart, lte: todayEnd };
      whereClause.status = 'APPROVED';
    } else if (filter === 'today-pending') {
      whereClause.appliedAt = { gte: todayStart, lte: todayEnd };
      whereClause.status = 'PENDING';
    } else if (filter === 'today-rejected') {
      whereClause.appliedAt = { gte: todayStart, lte: todayEnd };
      whereClause.status = 'REJECTED';
    } else if (filter === 'today-utilized') {
      whereClause.appliedAt = { gte: todayStart, lte: todayEnd };
      whereClause.status = 'UTILIZED';
    }

    const outpasses = await prisma.gatePass.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            email: true,
            name: true,
            mobile: true
          }
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });

    console.log(`✅ Retrieved ${outpasses.length} outpass details for filter: ${filter}`);
    res.json(outpasses);
  } catch (error) {
    console.error('❌ Error fetching HOD outpass details:', error);
    res.status(500).json({ error: 'Failed to fetch HOD outpass details' });
  }
};


