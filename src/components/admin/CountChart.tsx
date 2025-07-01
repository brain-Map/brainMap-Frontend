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
    students: 45,
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
    students: 89,
    experts: 18,
    moderators: 1,
    total: 108,
  },
  {
    month: "May 2024",
    students: 134,
    experts: 22,
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
const currentMonth = registrationData[registrationData.length - 1];
const previousMonth = registrationData[registrationData.length - 2];
const growthRate = (
  ((currentMonth.total - previousMonth.total) / previousMonth.total) *
  100
).toFixed(1);

const totalRegistrations = registrationData.reduce(
  (sum, month) => sum + month.total,
  0
);
const avgMonthlyGrowth = (totalRegistrations / registrationData.length).toFixed(
  0
);
export class CountChart extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-custom-primary">
                User Registration Trends
              </CardTitle>
              <CardDescription>
                Monthly user registrations over the past 12 months
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-custom-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">
                +{growthRate}% this month
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Growth Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-3 bg-custom-value3 rounded-lg">
                <div className="p-2 bg-custom-secondary rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-custom-value1">
                    Total Registrations
                  </p>
                  <p className="text-lg font-bold text-custom-primary">
                    {totalRegistrations.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-custom-value3 rounded-lg">
                <div className="p-2 bg-custom-primary rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-custom-value1">Avg Monthly</p>
                  <p className="text-lg font-bold text-custom-primary">
                    {avgMonthlyGrowth}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-custom-value3 rounded-lg">
                <div className="p-2 bg-custom-success rounded-lg">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-custom-value1">Peak Month</p>
                  <p className="text-lg font-bold text-custom-primary">
                    Dec 2024
                  </p>
                </div>
              </div>
            </div>
            {/* Line Chart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  Strong upward trend with {growthRate}% growth this month. Student registrations show consistent growth,
                  indicating healthy platform adoption.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Role Balance</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Domain expert registrations are growing steadily, maintaining a healthy student-to-expert ratio for
                  quality educational support.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default CountChart;
