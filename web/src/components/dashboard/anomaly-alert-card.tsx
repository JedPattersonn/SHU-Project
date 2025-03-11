import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnomalyAlertCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Anomaly Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium">Anomaly Alert</h3>
                        <p className="text-sm text-muted-foreground"> </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}