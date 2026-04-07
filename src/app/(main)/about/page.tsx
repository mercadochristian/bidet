'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: custom * 0.1 },
  }),
}

const STEPS = [
  {
    icon: '🔍',
    title: 'Browse',
    description: 'Find places near you and check if they have a bidet',
  },
  {
    icon: '📝',
    title: 'Report',
    description: 'Submit a report with photo proof of bidet availability',
  },
  {
    icon: '👍',
    title: 'Vote',
    description: 'Upvote or downvote reports to keep info accurate',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Hero Section */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-center py-6 space-y-3"
        >
          <span className="text-7xl block select-none">💧</span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Bidet</h1>
          <p className="text-lg text-muted-foreground">Find bidets near you</p>
        </motion.div>

        {/* Origin Story Section */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">The Story</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>
                Bidet was inspired by the Filipino Instagram account{' '}
                <a
                  href="https://www.instagram.com/meronbangbidet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  @meronbangbidet
                </a>{' '}
                ("Meron Bang Bidet?" — "Is There a Bidet?"), which reviews whether establishments
                in the Philippines have bidets in their restrooms.
              </p>
              <p>
                We turned that idea into a community-driven platform where anyone can report and
                discover bidet availability at any location.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works Section */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">How It Works</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {STEPS.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xl">
                    {step.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Credit Section */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <Card>
            <CardContent className="pt-4 pb-4 space-y-2 text-center text-sm text-muted-foreground">
              <p>Built with ❤️ by the community</p>
              <p>
                Inspired by{' '}
                <a
                  href="https://www.instagram.com/meronbangbidet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  @meronbangbidet
                </a>
              </p>
              <p className="text-xs">Data sourced from community reports and @meronbangbidet</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
