import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOutUserAction } from "@/lib/action";

export function SignOutDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link">Sign Out</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>Are you sure you want to sign out?</DialogDescription>
        </DialogHeader>
        <form action={signOutUserAction} className="grid gap-4 py-4">
          <DialogFooter>
            <Button variant="destructive" type="submit">
              Yes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
