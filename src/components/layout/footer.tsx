"use client";

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Facebook, Instagram, Rss, Twitter} from "lucide-react"
import Link from "next/link"
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-muted py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and site name */}
                    <div className="flex flex-col items-start">
                        <Link href="/public" className="flex items-center space-x-2">
                            <Image src={"/images/mono-arc-center.svg"} height={40} width={40} alt=""/>
                            <span className="text-xl font-bold">MonoArc</span>
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">Where every voice finds its audience.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm hover:underline">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
                            <li><Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm hover:underline">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5"/>
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5"/>
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5"/>
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                <Rss className="h-5 w-5"/>
                                <span className="sr-only">RSS Feed</span>
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div>
                        <h3 className="font-semibold mb-4">Subscribe to Our Newsletter</h3>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full"
                            />
                            <Button type="submit" className="w-full">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    className="mt-8 pt-8 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} MonoArc. All rights reserved.
                </div>
            </div>
        </footer>
    )
}