import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import postCampaignImage from "CollabifyyConnect\attached_assets\generated_images\modi.jpeg";
import productWorkflowImage from "@assets/product_workflow_1764049705865.jpg";
import aiAgentImage from "@assets/Live_ai_agent_1764049741207.jpg";

const features = [
  {
    title: "Post-Campaign Insights & Automation",
    image: postCampaignImage,
    description: "Real-time tracking, comprehensive ROI analysis, and automated performance reports",
  },
  {
    title: "Product Workflow",
    image: productWorkflowImage,
    description: "AI-automated campaigns or manual launch with AI-assisted support for maximum flexibility",
  },
  {
    title: "Live AI Agent & Agentic Ecosystem",
    image: aiAgentImage,
    description: "Talk to AI agents live, full autonomic ecosystem handling strategy, execution, and reporting",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-accent/20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
            <span className="inline-block">
              Powerful{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Features
              </span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in creator-brand collaborations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card
                className="hover-elevate transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col backdrop-blur-md bg-card/80 border border-white/10 shadow-xl"
                data-testid={`card-feature-${index}`}
              >
                <div className="aspect-video overflow-hidden bg-muted relative">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-feature-${index}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex-1 flex flex-col p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
