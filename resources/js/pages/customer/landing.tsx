import CustomerLayout from '@/layouts/customer-layout';
import { Meteors } from '@/components/ui/meteors';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/moving-border';
import { SkeletonTwo } from '@/components/feature-section';
import { cn } from '@/lib/utils';
import { FocusCards } from '@/components/ui/focus-cards';

const cards = [
    {
        title: "Forest Adventure",
        src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Valley of life",
        src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];
const LandingPage = () => {
    return (
        <CustomerLayout>
            <div className="">
                <section className="relative flex h-screen w-full justify-center lg:justify-between max-w-7xl mx-auto">
                    <div className="relative flex h-full flex-col items-start justify-center overflow-hidden py-8">
                        <div className="px-4 py-10 md:py-20">
                            <h1 className="relative z-10 mx-auto max-w-4xl text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
                                {'ORION STUDIO'.split(' ').map((word, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                            ease: 'easeInOut',
                                        }}
                                        className="mr-2 inline-block"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </h1>
                            <motion.p
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.8,
                                }}
                                className="relative z-10 mx-auto mt-4 max-w-xl py-4 text-lg font-normal text-neutral-600 dark:text-neutral-400"
                            >
                                Abadikan setiap momen berharga dengan sentuhan profesional. Studio kami menghadirkan pencahayaan sempurna, suasana
                                nyaman, dan konsep kreatif untuk menghasilkan foto yang memukau dan penuh cerita.
                            </motion.p>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: 1,
                                }}
                                className="relative z-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
                            >
                                <Button
                                    borderRadius="0.5rem"
                                    containerClassName={'h-10'}
                                    className="border-neutral-200 bg-white text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    Galeri
                                </Button>
                            </motion.div>
                        </div>
                        <Meteors number={25} />
                    </div>
                    <div className={'absolute top-1/2 right-0 -translate-y-1/2 hidden lg:block'}>
                        <SkeletonTwo />
                    </div>
                </section>
                <section className={"mb-20"}>
                    <div className={"max-w-7xl mx-auto px-4 flex justify-center flex-col items-center"}>
                        <h1 className={"text-3xl font-bold"}>Fotografi untuk Setiap Pencapaian Hidup Anda</h1>
                        <p className={"mb-8 mt-2"}>Ambil inspirasi dari galeri kami untuk menciptakan momen indah milik Anda sendiri!</p>
                        <FocusCards className={"md:grid-cols-2"} cards={cards} />
                    </div>
                </section>
            </div>
        </CustomerLayout>
    );
}

export default LandingPage;
