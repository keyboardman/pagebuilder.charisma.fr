import { Card, CardHeader, CardDescription, CardContent } from "@editeur/components/ui/card";
import { type ReactNode } from "react";

export function NodeSettingsWrapper({ header, content }: { header?: ReactNode, content: ReactNode }) {
    return (
        <Card className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {header && (
                <CardHeader className="pb-4 shrink-0">
                    <CardDescription> {header}</CardDescription>
                </CardHeader>
            )}
            <CardContent className="flex-1 overflow-y-auto min-h-0 mb-4">
                {content}
            </CardContent>
        </Card>
    );
}