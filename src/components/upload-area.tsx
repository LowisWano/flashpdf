import { Upload } from "lucide-react"
import { AppWindowIcon, CodeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"


export default function UploadArea() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="upload-pdf">
        <TabsList>
          <TabsTrigger value="upload-pdf">Upload PDF</TabsTrigger>
          <TabsTrigger value="paste-text">Paste text</TabsTrigger>
        </TabsList>
        <TabsContent value="upload-pdf">
          <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
            <CardContent className="p-12">
              <div
                className={`text-center transition-transform`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drop your PDF here</h3>
                <p className="text-gray-600 mb-6">or click to browse your files</p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                  
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </Button>
                <p className="text-sm text-gray-500 mt-4">Supports PDF files up to 50MB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paste-text">
          <Textarea className="bg-white h-50 p-5" placeholder="Put your notes here. We'll do the rest."/>
        </TabsContent>
      </Tabs>
    </div>
  )
}