const stats = [
    { value: '50%', label: 'giảm thời gian họp', color: 'text-[#6ffbbe]' },
    { value: '2.5x', label: 'tăng tốc giao hàng', color: 'text-[#d8e2ff]' },
    { value: '99.9%', label: 'uptime ổn định', color: 'text-[#ffddb8]' },
    { value: '30+', label: 'dự án đã quản lý', color: 'text-[#4edea3]' },
];

const testimonials = [
    {
        quote: '"Flowise giúp chúng tôi cắt giảm 40% thời gian họp hàng tuần. Cuối cùng cũng có thể tập trung vào công việc thực sự."',
        name: 'Nguyễn Minh Hà',
        role: 'Project Manager',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXy1J-AWJxbWjLIix2TkThv1HsmJiHbfFBNXfilg2aqVkJ7e6_1R3buNI8HFF9zuYWzBzkQardIOr7j21tSJl_nhx3J_gz9ta55O7htEVzNU5u8GYMdIOHokru3VbtwJkoU1F6hfPjtj6xBfU6zK60oK73EK8yTaQOfu8FHJDOq1tNaiwdJWzOm1LJpmGu3HbMEC5z6Z5yoO3DK31_5l1ZxtMClJABBxczxw0v0DVhE1egcRDg5G_qac5goT4HwDE9IWImDX5lpfWK',
        accent: false,
    },
    {
        quote: '"Giao diện sạch sẽ, không rối mắt. Đội dev của tôi từ chối dùng tool khác sau khi trải nghiệm Flowise."',
        name: 'Trần Đức Long',
        role: 'Tech Lead',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKax0UpFrUNdBwbs393piFbq_4fRkFiltaAv0IIvnO6WsQmhSE3RXY6thzvFnFOniILama9c_rixcfO0hQOg5EHzdsuqRFXrATyKg93vy4PoXbhlrD6_UgNn-r0B8d3SPjgLk4w0hXPglx-9g-kr9mrjBaw2ap_MWHGqO0Lsbv7j6e7UQ7jYXEu8y1kOTkOvZzutfBhF93a6JpiKN9duzbrLVCB1lOvPdhKA5AxlLPBiLLfCtljLKNh9-1ydypOPe7JMtjymEuR-mt',
        accent: true,
    },
    {
        quote: '"Cuối cùng cũng có một PM tool giúp chúng tôi ship sản phẩm thay vì chỉ tổ chức backlog."',
        name: 'Lê Thị Mai Anh',
        role: 'Founder, Startup XYZ',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpj-iF-HbqgZEEnWRyhUr8z4n6VtvTru9FqpouVY16T4A6uvQ55Tj_A_3yDIl2uaKJ4vLwSZv2GWJjkRRb_JoOXLu6c88aAjnAr7C5GmWbqi9xwsBhLWFpaKcIxvs5ilckswXclSi17X82nw0_W9uKwCZJbBwLjY-vRudgixGRQh_0AlVv7bqSNx44pyi5fYAk71IjfMOoyK0Btpu__wjae6Yomz_Hbn0sTkU8Zj6Jus1qD0buww1xPISYQuaYn9xQeVkNei6AOmuC',
        accent: false,
    },
];

export default function SocialProof() {
    return (
        <section className="py-24 bg-[#141b2b] text-white">
            <div className="max-w-7xl mx-auto px-10">
                {/* Section label */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-[#adc6ff] font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        Kết quả thực tế
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Con số không biết nói dối
                    </h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Đội nhóm sử dụng Flowise làm việc nhanh hơn, hiệu quả hơn và ít lãng phí thời gian hơn.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white/5 rounded-2xl p-8 text-center border border-white/5 hover:border-white/10 transition-colors">
                            <div className={`text-4xl md:text-5xl font-extrabold ${stat.color} mb-2`}>{stat.value}</div>
                            <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className={`bg-white/5 p-8 rounded-2xl border border-white/5 ${t.accent ? 'border-t-4 border-t-[#0058be]' : ''}`}
                        >
                            <p className="text-base italic mb-8 leading-relaxed text-slate-300">{t.quote}</p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-xl object-cover" />
                                <div>
                                    <div className="font-bold text-white text-sm">{t.name}</div>
                                    <div className="text-xs text-slate-500 font-semibold">
                                        {t.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
