"use client";

import React, { Component } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Users, Award, Shield } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

// Sample data for the last 12 months
const registrationData = [
  {
    month: "Jan 2024",
    students: 4,
    experts: 8,
    moderators: 1,
    total: 54,
  },
  {
    month: "Feb 2024",
    students: 62,
    experts: 12,
    moderators: 0,
    total: 74,
  },
  {
    month: "Mar 2024",
    students: 78,
    experts: 15,
    moderators: 2,
    total: 95,
  },
  {
    month: "Apr 2024",
    students: 9,
    experts: 18,
    moderators: 1,
    total: 108,
  },
  {
    month: "May 2024",
    students: 134,
    experts: 2,
    moderators: 3,
    total: 159,
  },
  {
    month: "Jun 2024",
    students: 156,
    experts: 19,
    moderators: 1,
    total: 176,
  },
  {
    month: "Jul 2024",
    students: 142,
    experts: 25,
    moderators: 2,
    total: 169,
  },
  {
    month: "Aug 2024",
    students: 178,
    experts: 28,
    moderators: 1,
    total: 207,
  },
  {
    month: "Sep 2024",
    students: 195,
    experts: 31,
    moderators: 2,
    total: 228,
  },
  {
    month: "Oct 2024",
    students: 167,
    experts: 24,
    moderators: 1,
    total: 192,
  },
  {
    month: "Nov 2024",
    students: 189,
    experts: 29,
    moderators: 3,
    total: 221,
  },
  {
    month: "Dec 2024",
    students: 203,
    experts: 33,
    moderators: 2,
    total: 238,
  },
];

// calculate growth metrics
const growthRate = 12.2
const avgMonthlyGrowth = 23
const totalRegistrations = 1233

export class CountChart extends Component<{ userTrend?: any }, {}> {
  render() {
    // Use passed userTrend data if available, otherwise use the sample data
    const chartData = this.props.userTrend && Array.isArray(this.props.userTrend)
      ? this.props.userTrend.map((item: any) => ({
          month: `${item.month} ${item.year}`,
          students: item.projectMemberCount || 0,
          experts: item.mentorCount || 0, 
          moderators: item.modaratorCount || 0,
          total: (item.projectMemberCount || 0) + (item.mentorCount || 0) + (item.modaratorCount || 0),
        }))
      : registrationData;
      
    // Calculate the latest month's growth rate if data is available
    const latestMonthGrowth = chartData.length >= 2
      ? ((chartData[chartData.length - 1].total - chartData[chartData.length - 2].total) / 
         (chartData[chartData.length - 2].total || 1) * 100).toFixed(1)
      : growthRate.toFixed(1);
      
    return (
      <Card className=" border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary mb-1">
                User Registration Trends
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Monthly user registrations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                +{latestMonthGrowth}% this month
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {/* Growth Metrics */}
            <div className="grid gap-4 md:grid-cols-3 mb-6 p-4">
              {/* Total Registrations */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Registrations</p>
                  <p className="text-2xl font-bold text-blue-900 leading-none">
                    {chartData.reduce((sum: number, item: any) => sum + item.total, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Avg Monthly */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Avg Monthly</p>
                  <p className="text-2xl font-bold text-blue-900 leading-none">
                    {Math.round(chartData.reduce((sum: number, item: any) => sum + item.total, 0) / (chartData.length || 1))}
                  </p>
                </div>
              </div>

              {/* Peak Month */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Peak Month</p>
                  <p className="text-2xl font-bold text-blue-900 leading-none">
                    {chartData.reduce((max: any, item: any) => 
                      (max.total || 0) > item.total ? max : item, {}).month || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {/* Line Chart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Legend />

                  {/* Total registrations line - thickest */}
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3D52A0"
                    strokeWidth={3}
                    dot={{ fill: "#3D52A0", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3D52A0", strokeWidth: 2 }}
                    name="Total Registrations"
                  />

                  {/* Students line */}
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#7091E6"
                    strokeWidth={2}
                    dot={{ fill: "#7091E6", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "#7091E6", strokeWidth: 2 }}
                    name="Students"
                  />

                  {/* Domain Experts line */}
                  <Line
                    type="monotone"
                    dataKey="experts"
                    stroke="#F4D06F"
                    strokeWidth={2}
                    dot={{ fill: "#F4D06F", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "#F4D06F", strokeWidth: 2 }}
                    name="Domain Experts"
                  />

                  {/* Moderators line */}
                  <Line
                    type="monotone"
                    dataKey="moderators"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    dot={{ fill: "#FF6B6B", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "#FF6B6B", strokeWidth: 2 }}
                    name="Moderators"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Growth Trend</h4>
                </div>
                <p className="text-sm text-gray-700">
                  {parseFloat(latestMonthGrowth) > 0 ? 'Positive' : 'Negative'} trend with {latestMonthGrowth}% growth this month. 
                  {chartData.length >= 3 && 
                   chartData[chartData.length-1].students > chartData[chartData.length-3].students ? 
                   ' Student registrations show growth over the last quarter.' : 
                   ' Student registration patterns require attention.'}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Role Balance</h4>
                </div>
                <p className="text-sm text-gray-700">
                  {chartData.reduce((sum: number, item: any) => sum + item.experts, 0) > 0 ? 
                   'Domain expert presence is maintaining engagement.' : 
                   'More domain experts are needed to support the platform growth.'} 
                  {chartData.reduce((sum: number, item: any) => sum + item.moderators, 0) > 0 ? 
                   ' Moderator participation helps maintain quality interactions.' : 
                   ' Consider recruiting more moderators to maintain platform quality.'}
                </p>
              </div>
            </div>
        </CardContent>
      </Card>
    );
  }
}

export default CountChart;
