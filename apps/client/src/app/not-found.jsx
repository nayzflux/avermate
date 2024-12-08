import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function NotFound() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className='absolute top-4 left-6'>
            <Link className="flex gap-4 items-center " href={"/"}>
                <img className="size-8 rounded-lg" src="/logo.svg" alt="Logo" />
                Avermate
            </Link></div>
            <Card className="w-[420px] max-w-[90%] border-none ">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-xl mb-4">Oups! Page non trouvée</p>
                    <p className="text-muted-foreground">
                        La page que vous recherchez a peut-être été supprimée, son nom a été changé ou elle est temporairement indisponible.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/">Retour à l'accueil</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

