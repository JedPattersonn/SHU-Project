import {Card, CardContent, CardTitle} from "@/components/ui/card";

export function StatCard({title, value}: {title: string, value: string}) {
    return (
        <Card>
            <CardContent >
                <CardTitle>
                    {title}
                </CardTitle>
                <div className="text-xl font-bold">
                    {value}
                </div>
            </CardContent>
        </Card>
    )
}