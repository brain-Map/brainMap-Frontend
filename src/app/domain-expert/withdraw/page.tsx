"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, DollarSign, Loader2, ShieldCheck, Wallet } from "lucide-react";

type WalletResponse = {
	walletId: string;
	holdAmount: number;
	releasedAmount: number;
	systemCharged: number;
	withdrawnAmount: number;
	belongsTo: string; // domain expert id
	domainExpertName: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	lastTransactionAt: string;
};

type BankDetails = {
	accountHolder: string;
	bankName: string;
	accountNumber: string;
	swiftOrIfsc: string;
	note?: string;
};

export default function WithdrawPage() {
	const { user } = useAuth();
	const [balance, setBalance] = useState<WalletResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<BankDetails>({
		accountHolder: "",
		bankName: "",
		accountNumber: "",
		swiftOrIfsc: "",
		note: "",
	});
	const [amount, setAmount] = useState<string>("");
	const [submitting, setSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

			// Business rule: maximum withdrawable amount equals releasedAmount
			const available = useMemo(() => Number(balance?.releasedAmount ?? 0), [balance]);

	useEffect(() => {
		if (!user?.id) {
			setLoading(false);
			return;
		}
		const fetchBalance = async () => {
			try {
				setLoading(true);
				setError(null);
			const res = await api.get<WalletResponse>(`/api/v1/wallet/${user.id}`);
			setBalance(res.data || null);
			} catch (e: any) {
				console.error("Failed to fetch wallet:", e);
				setError(e?.message || "Failed to load wallet balance");
			} finally {
				setLoading(false);
			}
		};
		fetchBalance();
	}, [user?.id]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (name === "amount") setAmount(value);
		else setForm((f) => ({ ...f, [name]: value }));
	};

	const validate = (): string | null => {
		if (!form.accountHolder.trim()) return "Account holder name is required";
		if (!form.bankName.trim()) return "Bank name is required";
		if (!form.accountNumber.trim()) return "Account number is required";
		if (!form.swiftOrIfsc.trim()) return "IFSC/SWIFT is required";
		const amt = Number(amount);
		if (!amount || isNaN(amt) || amt <= 0) return "Please enter a valid withdrawal amount";
		if (amt > available) return "Amount exceeds available balance";
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessMsg(null);
		setSubmitError(null);
		const err = validate();
		if (err) {
			setSubmitError(err);
			return;
		}
		if (!user?.id) {
			setSubmitError("User not authenticated");
			return;
		}

		try {
			setSubmitting(true);
			const amt = Number(amount);
			const resp = await api.post(`/api/v1/wallet/withdraw/${user.id}`, { amount: amt });
			// Assume API returns a message
			const msg = typeof resp.data === "string" ? resp.data : resp.data?.message || "Withdrawal request submitted";
			setSuccessMsg(msg);
			// Refresh balance after success
					try {
						const res = await api.get<WalletResponse>(`/api/v1/wallet/${user.id}`);
						setBalance(res.data || null);
					} catch {}
			setAmount("");
			setForm({ accountHolder: "", bankName: "", accountNumber: "", swiftOrIfsc: "", note: "" });
		} catch (e: any) {
			console.error("Withdraw submit failed:", e);
			const msg = e?.response?.data?.message || e?.message || "Failed to submit withdrawal";
			setSubmitError(msg);
		} finally {
			setSubmitting(false);
		}
	};

	const formatCurrency = (n?: number) => `LKR${(n ?? 0).toFixed(2)}`;

	return (
		<div className="flex-1 overflow-auto">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-100 rounded-lg text-primary">
							<Wallet className="w-8 h-8" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Withdraw Funds</h1>
							<p className="text-gray-600">Request a payout of your released balance to your bank account.</p>
						</div>
					</div>
				</div>

				{/* Balance Card */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Available Balance</p>
							<p className="text-2xl font-semibold text-gray-900 mt-1">
								{loading ? (
									<span className="inline-block h-6 w-28 bg-gray-200 rounded animate-pulse" />
								) : (
									formatCurrency(available)
								)}
							</p>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure withdrawal
						</div>
					</div>
					{error && (
						<div className="mt-3 text-sm text-red-600 flex items-center gap-2">
							<AlertCircle className="w-4 h-4" /> {error}
						</div>
					)}
				</div>

				{/* Withdraw Form */}
				<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6 grid gap-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
							<Input
								name="accountHolder"
								placeholder="John Doe"
								value={form.accountHolder}
								onChange={onChange}
								className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
								required
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
								<Input
									name="bankName"
									placeholder="Bank of Example"
									value={form.bankName}
									onChange={onChange}
									className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
								<Input
									name="accountNumber"
									placeholder="XXXX-XXXX-XXXX"
									value={form.accountNumber}
									onChange={onChange}
									className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">IFSC / SWIFT Code</label>
								<Input
									name="swiftOrIfsc"
									placeholder="HDFC0001234 / BOFAUS3N"
									value={form.swiftOrIfsc}
									onChange={onChange}
									className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										name="amount"
										type="number"
										min={0}
										step="0.01"
										placeholder="0.00"
										value={amount}
										onChange={onChange}
										className="pl-9 border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
										aria-invalid={Number(amount) > available}
										required
									/>
								</div>
								<p className="mt-1 text-xs text-gray-500">Max available: {formatCurrency(available)}</p>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
							<Textarea
								name="note"
								placeholder="Any special instructions or context for the withdrawal"
								value={form.note}
								onChange={onChange}
								className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
								rows={3}
							/>
						</div>

						{submitError && (
							<div className="text-sm text-red-600 flex items-center gap-2">
								<AlertCircle className="w-4 h-4" /> {submitError}
							</div>
						)}
						{successMsg && (
							<div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-3 flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4" /> {successMsg}
							</div>
						)}
					</div>
					<div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2">
						<Button
							type="submit"
							disabled={submitting || loading || available <= 0}
							className="min-w-32"
						>
							{submitting ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" /> Processing...
								</>
							) : (
								"Withdraw"
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
