import React, { useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Navbar,
  NavbarContent
} from "@nextui-org/react";
import { ArrowLeft } from 'lucide-react';

const QRScannerComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = document.getElementById('qr-video') as HTMLVideoElement;
    if (videoElement) {
      const qrScanner = new QrScanner(
        videoElement,
        result => {
          try {
            const qrData = result.data;
            const qrPattern = /^\/client\/table\/\d+$/;
            if (qrPattern.test(qrData)) {
              navigate(qrData);
            } else {
              throw new Error('QR inválido, vuelva a intentarlo');
            }
          } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
            setIsOpen(true);
          }
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      );

      qrScanner.start().catch(() => {
        setError('Error al iniciar la cámara');
        setIsOpen(true);
      });

      return () => {
        qrScanner.destroy();
      };
    }
  }, [navigate]);

  return (
    <div className="dark text-foreground bg-background min-h-screen">
      {/* Navbar */}
      <Navbar isBordered className="fixed top-0 w-full">
        <NavbarContent>
          <Button
            onPress={() => navigate('/client/dashboard')}
            className="flex items-center p-2 text-sm"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver
          </Button>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-20 px-4">

        {/* QR Scanner */}
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-center">
            <h1 className="text-xl font-semibold text-center">
              Escanea el Código QR
            </h1>
          </CardHeader>
          <CardBody>
            <div
              className="rounded-2xl overflow-hidden mb-4 relative"
              style={{
                height: '75vh',
                maxHeight: '500px',
              }}
            >
              <video
                id="qr-video"
                className="w-full h-full object-cover"
                style={{
                  transform: 'scale(1.05)',
                  willChange: 'transform',
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              Posiciona el código QR dentro del marco
            </p>
          </CardBody>
        </Card>

        {/* Error Modal */}
        <Modal
          isOpen={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-sm">
                  Error de Escaneo
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm">
                    {error || 'Error al escanear el código QR. Por favor, intente nuevamente.'}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                    className="text-sm"
                  >
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default QRScannerComponent;
