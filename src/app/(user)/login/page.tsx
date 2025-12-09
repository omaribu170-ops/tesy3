
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Smartphone, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = () => {
        if (phone.length < 11) return;
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleVerify = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/home'); // Redirect to home
        }, 1500);
    };

    const handleChangeOtp = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Automatic focus next
        if (element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
            <div className="w-full max-w-sm mx-auto space-y-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-[--primary] to-[--secondary] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-200">
                        <span className="text-white font-bold text-3xl">H</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">تسجيل الدخول</h1>
                    <p className="text-gray-500">أهلاً بك في ذا هب، مساحتك الخاصة للعمل والترفيه.</p>
                </div>

                {step === 1 ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                            <div className="relative">
                                <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    placeholder="01xxxxxxxxx"
                                    className="w-full pr-12 pl-4 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[--primary] outline-none transition-all font-mono text-lg text-left"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    style={{ direction: 'ltr' }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSendOtp}
                            disabled={loading || phone.length < 11}
                            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="loader"></span> : <span>إرسال رمز التحقق</span>}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                        <div className="text-center">
                            <p className="font-bold text-gray-800">تم إرسال الرمز إلى {phone}</p>
                            <button onClick={() => setStep(1)} className="text-[--primary] text-sm font-bold mt-1">تغيير الرقم</button>
                        </div>

                        <div className="flex justify-center gap-4" style={{ direction: 'ltr' }}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    className="w-14 h-16 rounded-xl border-2 border-gray-200 text-center text-2xl font-bold focus:border-[--primary] focus:ring-4 ring-orange-50 outline-none transition-all"
                                    value={data}
                                    onChange={e => handleChangeOtp(e.target, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={loading || otp.some(d => !d)}
                            className="w-full py-4 rounded-xl font-bold bg-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="loader"></span> : <span>تأكيد الدخول</span>}
                            {!loading && <CheckCircle className="w-5 h-5" />}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-400 text-sm">لم يصلك الرمز؟ <button className="text-[--primary] font-bold">إعادة الإرسال</button></p>
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-8">
                    بالتسجيل أنت توافق على <a href="#" className="underline">الشروط والأحكام</a>
                </p>
            </div>
        </div>
    );
}
