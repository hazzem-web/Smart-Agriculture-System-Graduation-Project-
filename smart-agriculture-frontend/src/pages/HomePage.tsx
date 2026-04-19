import { Droplets, TreesIcon as Plant, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative bg-gradient-to-b from-primary/10 to-background overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Empowering Farmers with AI
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
            Next-Gen <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Agriculture</span> Solutions
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed">
            Cutting-edge tools for modern farming. Identify plant diseases instantly and optimize your irrigation using our intelligent AI-driven system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/detect")}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/about")}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
              We provide essential tools to help you manage your farm efficiently and increase your yield.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Disease Detection Card */}
            <div 
              onClick={() => navigate("/detect")}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-primary/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="h-14 w-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <Plant className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">Disease Detection</h3>
                <p className="text-muted-foreground flex-1 mb-6">
                  Upload photos of your plants to instantly identify diseases and receive actionable treatment recommendations powered by AI.
                </p>
                <div className="flex items-center text-sm font-semibold text-primary mt-auto">
                  Try it now <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Irrigation Advisor Card */}
            <div 
              onClick={() => navigate("/irrigation")}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-blue-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Droplets className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Irrigation Advisor</h3>
                <p className="text-muted-foreground flex-1 mb-6">
                  Get smart watering advice based on real-time soil sensors and localized weather forecasts to save water and keep plants healthy.
                </p>
                <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-auto">
                  Try it now <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
