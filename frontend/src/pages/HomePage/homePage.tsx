import {
    TopNav,
    HeroSection,
    HowItWorks,
    FeaturesSection,
    SocialProof,
    CTABanner,
    Footer,
} from './LandingPage';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
            <TopNav />
            <main>
                <HeroSection />
                <HowItWorks />
                <FeaturesSection />
                <SocialProof />
                <CTABanner />
            </main>
            <Footer />
        </div>
    );
}
